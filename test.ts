function getPropByString(obj, propString) {
    if (!propString)
        return obj;

    var prop, props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
        prop = props[i];

        var candidate = obj[prop];
        if (candidate !== undefined) {
            obj = candidate;
        } else {
            break;
        }
    }
    return obj[props[i]];
}
function access(obj: any, accessors: string[]) {
    for (const accessor of accessors) obj = obj[accessor];
    return obj;
}
function quick(obj, propString) {
    return propString.reduce((acc, curr) => acc[curr], obj);
}

var obj = {
    foo: {
        bar: {
            baz: 'x'
        }
    }
};
console.time("ok");
getPropByString(obj, 'foo.bar.baz'); // x
console.timeEnd("ok");
console.time("ok1");
access(obj, 'foo.bar.baz'.split(".")); // x
console.timeEnd("ok1");

console.time("ok12");
quick(obj, ['foo', 'bar', 'baz']); // x
console.timeEnd("ok12");