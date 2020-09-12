
export class svg2raster {
  constructor( download_button_id, file_name_id, bg_color_picker ) {
    this.download_button_id = download_button_id;
    this.file_name_id = file_name_id;
    this.bg_color_picker = bg_color_picker;
    this.filename = null;
    this.svg_root = null;

    this.init()
  }

  init () {
    // loading local files
    document.getElementById(this.download_button_id).addEventListener(`click`, this.get_parameters.bind(this), false);
  }

  // set_svg () {
  // }

  get_parameters () {
    this.svg_root = document.querySelector(`svg`);
    this.filename = document.getElementById(this.file_name_id).value || `image`;
    const bg_color_picker = document.getElementById(this.bg_color_picker);
    const bg_color = bg_color_picker.disabled ? `none` : bg_color_picker.value;

    // TODO: add size controls
    this.svg2raster( `png`, 1, 10, bg_color);
  }

  /*
  svg2raster parameters
    format: raster image format, native default is `png`, also supports `jpg` and `webp`
    quality: the image for jpeg and webp images, native default value is 0.92
    size_mult: image size multiplier for increased raster resolution
    bg_color: color of background, default is transparent for PNG
  */
  svg2raster( format = `png`, quality = 1, size_mult = 10, bg_color = `none`) { 
    const {width, height} = this.get_svg_dimensions();

    // create a deep clone of the SVG element
    let svg_clone = this.svg_root.cloneNode(true);

    // optionally set background color
    if ( bg_color && `none` != bg_color) {
      this.set_svg_background(svg_clone, bg_color);
    }

    // make sure SVG root has width and height
    // NOTE: Required for Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=700533
    svg_clone.setAttribute(`width`, width);
    svg_clone.setAttribute(`height`, height);

    // create a blob object from the cloned node
    // NOTE: WebKit does not honor MIME type:`image/svg+xml;charset=utf-8`, omit charset
    const blob = new Blob([svg_clone.outerHTML], {type:`image/svg+xml`} );

    // create a URL from the blob object
    let blobURL = window.URL.createObjectURL(blob);

    // create proxy image object for canvas
    let image = new Image();
    image.onload = () => {
      const canvas = document.createElement(`canvas`); 
      const context = canvas.getContext(`2d`);   
      // scale up image to improve resolution
      canvas.width = width * size_mult;
      canvas.height = height * size_mult;   
      // draw image in canvas    
      context.drawImage(image, 0, 0, canvas.width, canvas.height );  

      // create raster image URL
      let dataURL = canvas.toDataURL(`image/${format}`, quality); 

      // download canvas dataURL as image
      this.generate_download_link(`${this.filename}.${format}`, dataURL);
    };
    // load the blobURL in the image object
    image.src = blobURL;
  }

  get_svg_dimensions() {
    // first get the bounding box of the SVG root
    let {width, height} = this.svg_root.getBBox(); 

    // next get the aspect ratio from the viewBox
    let {vb_width, vb_height} = {width, height};
    const vb = this.svg_root.getAttribute(`viewBox`);
    if (vb) {
      const vb_split = vb.split(` `);
      vb_width = vb_split[2];
      vb_height = vb_split[3];
    }

    // finally, get explicit width and height attributes
    const svg_width = parseFloat(this.svg_root.getAttribute(`width`));  
    const svg_height = parseFloat(this.svg_root.getAttribute(`height`));

    // get CSS width and height
    let styles = window.getComputedStyle(this.svg_root);
    const css_width = parseFloat(styles.getPropertyValue(`width`));  
    const css_height = parseFloat(styles.getPropertyValue(`height`));

    // assign width and height
    width = css_width || svg_width || vb_width || width;
    height = css_height || svg_height || vb_height || height;

    return {width, height};
  }

  set_svg_background(svg_el, bg_color) {
    // get the the viewBox
    let {x, y} = 0;
    const vb = svg_el.getAttribute(`viewBox`);
    if (vb) {
      const vb_split = vb.split(` `);
      x = vb_split[0];
      y = vb_split[1];
    }

    const bg_el = document.createElementNS(`http://www.w3.org/2000/svg`, `rect`);
    bg_el.setAttribute(`x`, x);
    bg_el.setAttribute(`y`, y);
    bg_el.setAttribute(`width`, `100%`);
    bg_el.setAttribute(`height`, `100%`);
    bg_el.setAttribute(`fill`, bg_color);
    svg_el.insertBefore(bg_el, svg_el.firstChild);
  }

  generate_download_link(fileName, dataURL) {
    var link = document.createElement(`a`);
    link.download = fileName;
    link.href = dataURL;
    link.click();
    link.remove();
  }
}