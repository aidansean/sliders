<?php
$title = 'Feynman diagram maker' ;
$stylesheets = array('style.css') ;
$js_scripts  = array('functions.js') ;
include($_SERVER['FILE_PREFIX'] . '/_core/preamble.php') ;
?>
<meta http-equiv="content-type" content="application/xhtml+xml; charset=utf-8" />
  <div class="right">
    <div class="blurb center">
      <p>This page is a slider game thingy.</p>
      <canvas id="canvas_sliders" width="600" height="600"></canvas>
    </div>
  </div>

<?php foot() ; ?>
