const fs = require('fs');

let html = '';
const files = fs.readdirSync('./dev/components', { withFileTypes: true });
files.forEach(file => {
  if (file.isFile() && file.name.endsWith('.html')) {
    const content = fs.readFileSync(`./dev/components/${file.name}`, 'utf8');
    html += content;
  }
});
fs.writeFileSync('./assets/static/bundle.html', html);
