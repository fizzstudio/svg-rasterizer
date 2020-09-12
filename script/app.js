import { svg_loader } from "./svg_loader.js";
import { svg2raster } from "./svg2raster.js";


window.onload = function() {
  document.querySelectorAll(`[name=bg_color]`).forEach( (el) => {
    el.addEventListener(`change`, toggle_color_picker, false);
  })
  const svg_load = new svg_loader( `svg_upload`, `content`, set_options );
  const image_save = new svg2raster( `save_file_button`, `file_name`, `bg_color_picker` );
}

function set_options (svg_load) {
  const file_name_input = document.getElementById(`file_name`);
  file_name_input.value = svg_load.filename.replace(`.svg`,``);
}

function toggle_color_picker (event) {
  document.getElementById(`bg_color_picker`).disabled = `radio-color` === event.target.id ? false : true;
 }
