export class svg_loader {
  constructor( upload_button_id, svg_container_id, callback) {
    this.upload_button_id = upload_button_id;
    this.svg_container_id = svg_container_id;
    this.callback = callback;
    this.filename = null;

    this.init()
  }

  init () {
    // loading local files
    document.getElementById(this.upload_button_id).addEventListener(`change`, this.load_local_file.bind(this), false);
  }

  
  /* Uploads SVG files from local file system, based on file selected in input */
  load_local_file (event) {
    let file = event.target.files[0]; // FileList object
    if (file) {
      this.filename = file.name;
      const file_reader = new FileReader();
      if (`image/svg+xml` == file.type) {
        file_reader.readAsText(file);
        file_reader.addEventListener(`load`, function () {
          var file_content = file_reader.result;
          this.insert_svg(file_content);
        }.bind(this), false);
      }
    }
  }


  /* Inserts SVG files into HTML document */
  insert_svg (file_content) {
    // insert SVG file into HTML page
    const svg_container = document.getElementById(this.svg_container_id);
    svg_container.innerHTML = file_content;

    this.callback(this);
  }
}
