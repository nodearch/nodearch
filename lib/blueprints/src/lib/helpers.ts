import Handlebars from 'handlebars';

Handlebars.registerHelper('strArrayPrint', function (strArr) {
  return strArr.join(', ');
});

Handlebars.registerHelper('dataTypeFormat', function (value: any) {
  const vType = typeof value;

  if (vType === 'string') {
    return new Handlebars.SafeString(`'${value}'`);
  }
  else if (vType === 'object') {
    return new Handlebars.SafeString(`{ ${Object.keys(value).map(key => `${key}: ${value[key]}`).join(', ')} }`);
  }
  else {
    return value;
  }
});