# assembleMail
---
**Atomic Design** for Newsletter

Assemble static HTML and the used Atomic Design Patterns with the help of handlebars and assemble.io. Based partly on https://github.com/assemble/assemble-pattern-lab by Jon Schlinkert.


### Installation and usage
- run `npm install`
- run `bower install`to install the vendor files needed
- run `grunt`for a watch task. It compiles SASS files, concatenates the CSS and JS files.
- run `assemble-html`to assemble your .hbs files into static HTML and copy it into the *_dist* folder. It also creates the styleguide files in the *_dist/_styleguide* folder.
- run `serve`to start the express-server if needed.
- you can then visit your HTML-page at [http://localhost:3000/_dist/index.html](http://localhost:3000/_dist/index.html).

### Folder structure
[TODO]

### Workflow:
- add component (.hbs).
- add component based .scss-file.
- include .scss-file into app.scss.
- you can pass the content for the assembled HTML-file via YAML front matter or an external .yml or .json file in the data folder. The external file has to have the same name as the .hbs pattern or template. Global contents can be included into the data.json. It's the default file. Contents for the styleguide go into the data/pattern folder.
- include component into styleguide's config.json.
- run `grunt assemble-it` or 'grunt build' to assemble and copy the files into the *_dist* and *_styleguide* folders. The folders will be created if they don't exist already.

### Manage different settings for production and styleguide
If you want to configure different settings in styleguide and production code, here' how to proceed.

Best example is image paths. The image path for your production code is by default *./assets/images/*. But this path wouldn't work for the images within your styleguide patterns. So you have to pass different paths depending on the environment the files are compiled. You could set a handlebar for the image path in your pattern: `<img src="{{{ pattern.image-path }}}your-image.png" alt="" />`. Then you can define the production path via YAML front matter in your *whatever.hbs* and pass the context with the pattern call like so:
```hbs
---
  pattern-path:
   pattern:
    image-path: ./assets/images/
---

{{{ organism "pattern" pattern-path }}}
```
For the styleguide, you simply create a *.json* file with the same name as your pattern in the *data/pattern* folder and define the other path there:
```json
{
  "image-path": "../../../assets/images/"
}
```

##### Additional notes
- You shouldn't use camel-case naming for handlebars or filenames, because in some cases it confuses the assembler engine.
