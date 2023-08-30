enum Endian {
  big,
  little,
}
export class BinaryWriter {
  buffer: number[];
  position = 0;

  constructor(buffer: number[]) {
    this.buffer = buffer;
  }

  get length() {
    return this.buffer.length;
  }

  writeBytes(list: number[]) {
    this.buffer.push(...list);
    this.position += list.length;
  }

  writeInt(value: number, len: number, endian: Endian = Endian.big): void {
    const bytes = new Uint8Array(len);
    const dataView = new DataView(bytes.buffer);
    if (len === 1) {
      dataView.setUint8(0, value);
    } else if (len === 2) {
      dataView.setInt16(0, value, endian === Endian.little);
    } else if (len === 4) {
      dataView.setInt32(0, value, endian === Endian.little);
    } else if (len === 8) {
      dataView.setBigInt64(0, BigInt(value), endian === Endian.little);
    }
    this.buffer.push(...Array.from(bytes));
    this.position += len;
  }

  writeDouble(value: number, len: number, endian: Endian = Endian.big) {
    const bytes = new Uint8Array(new ArrayBuffer(len));
    const dataView = new DataView(bytes.buffer);
    if (len === 4) {
      dataView.setFloat32(0, value, endian === Endian.big);
    } else if (len === 8) {
      dataView.setFloat64(0, value, endian === Endian.big);
    }
    this.buffer.push(...Array.from(bytes));
    this.position += len;
  }

}
export class BinaryReader {
  position: number
  buffer: Uint8Array
  constructor(buffer: Uint8Array) {
    this.position = 0;
    this.buffer = buffer
  }
  get length(): number {
    return this.buffer.length;
  }
  read(): number {
    let byte = this.buffer[this.position];
    this.position += 1;
    return byte;
  }
  /// 从当前流中读取指定长度的字节整数，并使流的当前位置提升指定长度。
  /// [len] 指定长度
  /// len=1为number8,2为number16,4为number32,8为number64。ts中统一为number类型
  /// 返回整数
  readInt(len: number, endian: Endian = Endian.big) {
    let result = 0;
    const bytes = this.buffer.slice(this.position, this.position + len);
    const dataView = new DataView(bytes.buffer);
    if (len === 1) {
      result = dataView.getUint8(0);
    }
    if (len === 2) {
      result = dataView.getInt16(0, endian === Endian.little);
    }
    if (len === 4) {
      result = dataView.getInt32(0, endian === Endian.little);
    }
    if (len === 8) {
      result = Number(dataView.getBigInt64(0, endian === Endian.big));
    }
    this.position += len;
    return result;
  }

  readByte(endian: Endian = Endian.big): number {
    return this.readInt(1, endian);
  }
  /// 读取
  /// int长度=2
  readShort(endian: Endian = Endian.big): number {
    return this.readInt(2, endian);
  }

  /// 读取字节
  /// int长度=4
  readInt32(endian: Endian = Endian.big): number {
    return this.readInt(4, endian);
  }

  /// 读取字节
  /// int长度=8
  readLong(endian: Endian = Endian.big): number {
    return this.readInt(8, endian);
  }

  readBytes(len: number): Uint8Array {
    const bytes = this.buffer.slice(this.position, this.position + len);
    this.position += len;
    return bytes;
  }
  readFloat(len: number, endian: Endian = Endian.big): number {
    let result = 0.0;
    const bytes = this.buffer.slice(this.position, this.position + len);
    const dataView = new DataView(bytes.buffer);
    if (len === 4) {
      result = dataView.getFloat32(0, endian === Endian.little);
    }
    if (len === 8) {
      result = dataView.getFloat64(0, endian === Endian.little);
    }
    this.position += len;
    return result;
  }
}