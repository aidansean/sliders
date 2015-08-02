<?php
include_once($_SERVER['FILE_PREFIX']."/project_list/project_object.php") ;
$github_uri   = "https://github.com/aidansean/sliders" ;
$blogpost_uri = "http://aidansean.com/projects/?tag=sliders" ;
$project = new project_object("sliders", "Sliding tile game solver", "https://github.com/aidansean/sliders", "http://aidansean.com/projects/?tag=sliders", "sliders/images/project.jpg", "sliders/images/project_bw.jpg", "I was playing a <a href=\"http://www.puzzlescript.net/play.html?p=8931824\">PuzzelScript game</a> involving sliding blocks that i just couldn't solve.  So I wrote an algorithm to solve it.", "Maths,Games", "canvas,CSS,HTML,JavaScript") ;
?>