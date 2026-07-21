// PHP equivalent: unserialize($row['sku_list']) / serialize($data)

export function phpUnserialize(serialized: string): any {
  let pos = 0;

  function parseValue(): any {
    const type = serialized[pos];

    if (type === 'i') {
      const end = serialized.indexOf(';', pos);
      const value = parseInt(serialized.slice(pos + 2, end), 10);
      pos = end + 1;
      return value;
    }

    if (type === 'd') {
      const end = serialized.indexOf(';', pos);
      const value = parseFloat(serialized.slice(pos + 2, end));
      pos = end + 1;
      return value;
    }

    if (type === 's') {
      const colonIdx = serialized.indexOf(':', pos + 2);
      const len = parseInt(serialized.slice(pos + 2, colonIdx), 10);
      const start = colonIdx + 2; 
      const value = serialized.slice(start, start + len);
      pos = start + len + 2;  
      return value;
    }

    if (type === 'a') {
      const colonIdx = serialized.indexOf(':', pos + 2);
      const count = parseInt(serialized.slice(pos + 2, colonIdx), 10);
      pos = colonIdx + 2; 
      const result: any = {};
      let isList = true;
      let expectedIndex = 0;

      for (let i = 0; i < count; i++) {
        const key = parseValue();
        const value = parseValue();
        result[key] = value;
        if (key !== expectedIndex) isList = false;
        expectedIndex++;
      }
      pos++; 
      return isList ? Object.values(result) : result;
    }

    if (type === 'N') {
      pos += 2; 
      return null;
    }

    if (type === 'b') {
      const end = serialized.indexOf(';', pos);
      const value = serialized.slice(pos + 2, end) === '1';
      pos = end + 1;
      return value;
    }

    throw new Error(`Unsupported PHP serialize type: ${type} at position ${pos}`);
  }

  return parseValue();
}

/**
 * Converts a JS value to a PHP-serialized string — for writing back to
 * legacy columns during the transition period if any old PHP code still reads them.
 */
export function phpSerialize(value: any): string {
  if (value === null) return 'N;';
  if (typeof value === 'boolean') return `b:${value ? 1 : 0};`;
  if (typeof value === 'number') {
    return Number.isInteger(value) ? `i:${value};` : `d:${value};`;
  }
  if (typeof value === 'string') {
    return `s:${Buffer.byteLength(value, 'utf8')}:"${value}";`;
  }
  if (Array.isArray(value)) {
    const items = value.map((v, i) => phpSerialize(i) + phpSerialize(v)).join('');
    return `a:${value.length}:{${items}}`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    const items = keys.map((k) => phpSerialize(k) + phpSerialize(value[k])).join('');
    return `a:${keys.length}:{${items}}`;
  }
  throw new Error(`Cannot serialize value of type ${typeof value}`);
}