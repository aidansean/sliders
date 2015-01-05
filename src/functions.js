var canvas  = null ;
var context = null ;
var paintbrush = null ;

var nCol = 6 ;
var nRow = 5 ;
var stones_0 = [ [4,0] , [4,1] , [5,1] ] ;
var stones = [] ;
for(var i=0 ; i<stones_0.length ; i++){ stones.push(stones_0[i]) ; }
var target = [ 1,0 ] ;
var blocks = [ [3,0] , [3,1] , [3,3] , [3,4] ] ;
var nMoves = 1 ;
var last_move = null ;

var stones_history = [] ;
for(var i=0 ; i< stones.length ; i++){ stones_history.push([]) ; }

var active_stone = 0 ;
var cw = 600 ;
var ch = 600 ;

var sw = Math.ceil(cw/(nCol+2)) ;
var sh = sw ;
ch = sh*(nRow+2) ;

var path = [] ;
for(var i=0 ; i<nMoves ; i++){ path.push(0) ; }
var solution = [] ;
var carryover = 4*stones.length ;

var already_solved = false ;
var success   = false ;
var exhausted = false ;
var counter   = 0 ;
var sprint_counter = 0 ;
var delay = 500 ;
var steps_per_sprint = 100000 ;
var nPaths = Math.pow(carryover,nMoves) ;
var nSprints = Math.ceil(nPaths/steps_per_sprint) ;
var kill = false ;

function keydown(evt){
  var keyDownID = window.event ? event.keyCode : (evt.keyCode != 0 ? evt.keyCode : evt.which) ;
  switch(keyDownID){
    case 32:
      evt.preventDefault() ;
      cycle_stone() ;
      draw_all() ;
      break ;
    case 38:
    case 87: // North
      evt.preventDefault() ;
      move_stone(0) ;
      draw_all() ;
      break ;
    case 39:
    case 68: // East
      evt.preventDefault() ;
      move_stone(1) ;
      draw_all() ;
      break ;
    case 40:
    case 83: // South
      evt.preventDefault() ;
      move_stone(2) ;
      draw_all() ;
      break ;
    case 37:
    case 65: // West
      evt.preventDefault() ;
      move_stone(3) ;
      draw_all() ;
      break ;
    case 82: // Eeset
      for(var i=0 ; i<stones_0.length ; i++){
        stones[i] = stones_0[i] ;
      }
      draw_all() ;
      break ;
  }
  if(check_solution() && already_solved==false){
    alert('Well done!') ;
    already_solved = true ;
  }
}

var cells = null ;
function remake_cells(){
  cells = [] ;
  for(var i=0 ; i<nCol ; i++){
    cells.push([]) ;
    for(var j=0 ; j<nRow ; j++){
      cells[i].push(0) ;
    }
  }
}
function populate_blocks(){
  for(var i=0 ; i<blocks.length ; i++){
    var b = blocks[i] ;
    cells[b[0]][b[1]] = 1 ;
  }
}
function recreate_grid(){
  kill = true ;
  nRow = parseInt(Get('input_nRow').value) ;
  nCol = parseInt(Get('input_nCol').value) ;
  sw = Math.ceil(cw/(nCol+2)) ;
  sh = Math.ceil(sw) ;
  canvas.height = sh*(nRow+2) ;
  canvas.style.height = sh*(nRow+2) ;
  remake_cells() ;
  stones_0 = [] ;
  stones = [] ;
  blocks = [] ;
  target = [-9,-9] ;
  draw_all() ;
}

function start(){
  document.addEventListener('keydown',keydown) ;
  canvas = document.getElementById('canvas_sliders') ;
  context = canvas.getContext('2d') ;
  //context.translate(0.5,0.5) ;
  remake_cells() ;
  populate_blocks() ;
  draw_all() ;
  
  Get('canvas_stone' ).addEventListener('click', choose_stone ) ;
  Get('canvas_block' ).addEventListener('click', choose_block ) ;
  Get('canvas_target').addEventListener('click', choose_target) ;
  choose_stone() ;
  draw_thumbnails() ;
  
  Get('submit_grid'   ).addEventListener('click', recreate_grid ) ;
  Get('submit_solve'  ).addEventListener('click', user_autosolve) ;
  Get('canvas_sliders').addEventListener('click', canvas_click  ) ;
  //window.setTimeout('autosolve()', delay) ;
}

function canvas_click(e){
  kill = true ;
  var x = e.pageX - Get('canvas_sliders').offsetLeft ;
  var y = e.pageY - Get('canvas_sliders').offsetTop  ;
  var u = Math.floor((x-sw)/sw) ;
  var v = Math.floor((y-sh)/sh) ;
  if(u<0 || u>=nCol) return ;
  if(v<0 || v>=nRow) return ;
  if(paintbrush=='target'){
    target = [u,v] ;
  }
  else if(paintbrush=='block'){
    var add_block = true ;
    for(var i=0 ; i<blocks.length ; i++){
      if(blocks[i][0]==u && blocks[i][1]==v){
        blocks.splice(i,1) ;
        add_block = false ;
        break ;
      }
    }
    if(target[0]==u && target[1]==v) add_block = false ;
    if(add_block) blocks.push([u,v]) ;
  }
  else if(paintbrush=='stone'){
    var add_stone = true ;
    for(var i=0 ; i<stones.length ; i++){
      if(stones[i][0]==u && stones[i][1]==v){
        stones_0.splice(i,1) ;
        stones.splice(i,1) ;
        add_stones = false ;
        break ;
      }
    }
    if(target[0]==u && target[1]==v) add_stone = false ;
    if(add_stone){
      stones_0.push([u,v]) ;
      stones.push([u,v]) ;
      active_stone = stones.length-1 ;
    }
  }
  draw_all() ;
}

function Get(id){ return document.getElementById(id) ; }
function choose_stone(){
  Get('canvas_stone' ).className =     'selected' ;
  Get('canvas_block' ).className = 'not_selected' ;
  Get('canvas_target').className = 'not_selected' ;
  paintbrush = 'stone' ;
}
function choose_block(){
  Get('canvas_stone' ).className = 'not_selected' ;
  Get('canvas_block' ).className = '    selected' ;
  Get('canvas_target').className = 'not_selected' ;
  paintbrush = 'block' ;
}
function choose_target(){
  Get('canvas_stone' ).className = 'not_selected' ;
  Get('canvas_block' ).className = 'not_selected' ;
  Get('canvas_target').className =     'selected' ;
  paintbrush = 'target' ;
}

function draw_stone(ctx, x, y, r, label, color){
  ctx.fillStyle = color ;
  ctx.beginPath() ;
  ctx.arc(x, y, r, 0, 2*Math.PI, true) ;
  ctx.fill() ;
  ctx.fillStyle = 'white' ;
  ctx.textAlign = 'center' ;
  ctx.font = r + 'px arial , sans-serif' ;
  ctx.fillText(label, x, y+0.35*r) ;
}
function draw_block(ctx, x, y, w, h){
  ctx.fillStyle = 'rgb(224,200,183)' ;
  ctx.fillRect(x-1, y-1, w+2, h+2) ;
  
  ctx.fillStyle = 'rgb(173,88,32)' ;
  
  var bh = 0.4*h ;
  var y1 = y+0.05*h ;
  var y2 = y1+bh+0.1*h ;
  var x1 = x-2      ; var w1 = 0.35*w   ;
  var x2 = x+0.45*w ; var w2 = 0.9*w-w1 ;
  var x3 = x-2      ; var w3 = 0.65*w   ;
  var x4 = x+0.75*w ; var w4 = 0.9*w-w3 ;
  
  ctx.fillRect(x1, y1, w1+2, bh) ;
  ctx.fillRect(x2, y1, w2+2, bh) ;
  
  
  ctx.fillRect(x3, y2, w3+2, bh) ;
  ctx.fillRect(x4, y2, w4+2, bh) ;
}
function draw_target(ctx, cx, cy, r){
  var dt = 2*Math.PI/5 ;
  ctx.beginPath() ;
  var x = cx + r*Math.sin(0*dt) ;
  var y = cy - r*Math.cos(0*dt) ;
  ctx.moveTo(x,y) ;
  for(var i=1 ; i<=5 ; i++){
    x = cx + 0.4*r*Math.sin((i-0.5)*dt) ;
    y = cy - 0.4*r*Math.cos((i-0.5)*dt) ;
    ctx.lineTo(x,y) ;
    x = cx + r*Math.sin((i+0)*dt) ;
    y = cy - r*Math.cos((i+0)*dt) ;
    ctx.lineTo(x,y) ;
  }
  ctx.closePath() ;
  ctx.fillStyle = '#ffff00' ;
  ctx.fill() ;
  ctx.strokeStyle = 'black' ;
  ctx.lineWidth = 1 ;
  ctx.stroke() ;
}

function draw_thumbnails(){
  var context_stone  = Get('canvas_stone' ).getContext('2d') ;
  var context_block  = Get('canvas_block' ).getContext('2d') ;
  var context_target = Get('canvas_target').getContext('2d') ;
  context_stone .fillStyle = 'white' ;
  context_block .fillStyle = 'white' ;
  context_target.fillStyle = 'white' ;
  context_stone .fillRect(0,0,100,100) ;
  context_block .fillRect(0,0,100,100) ;
  context_target.fillRect(0,0,100,100) ;
  var cx = 50 ;
  var cy = 50 ;
  var r = 37.5 ;
  draw_stone (context_stone , 50, 50, 37.5, 'A', 'blue') ;
  draw_block (context_block , 10, 10, 80, 80) ;
  draw_target(context_target, 50, 50, 45) ;
}

function draw_all(){
  draw_grid() ;
  draw_target(context, (target[0]+1.5)*sw, (target[1]+1.5)*sh, 0.45*Math.min(sw,sh)) ;
  draw_stones() ;
}
function draw_grid(){
  context.fillStyle = 'white' ;
  context.fillRect(0,0,cw,ch) ;
  context.lineWidth = 2 ;
  for(var i=0 ; i<nCol+2 ; i++){
    for(var j=0 ; j<nRow+2 ; j++){
      var x = sw*i ;
      var y = sh*j ;
      context.fillStyle = ((i+j)%2==0) ? '#dddddd' : '#ffffff' ;
      context.fillRect(x, y, sw, sh) ;
    }
  }
  context.fillStyle = '#444444' ;
  for(var i=0 ; i<nCol+2 ; i++){
    draw_block(context, i*sw,           0, sw, sh) ;
    draw_block(context, i*sw, sh*(nRow+1), sw, sh) ;
  }
  for(var i=0 ; i<nRow+2 ; i++){
    draw_block(context,           0, i*sh, sw, sh) ;
    draw_block(context, sw*(nCol+1), i*sh, sw, sh) ;
  }
  
  for(var i=0 ; i<blocks.length ; i++){
    var b = blocks[i] ;
    draw_block(context, sw+b[0]*sw, sh+b[1]*sh, sw, sh) ;
  }
}
function draw_stones(){
  for(var i=0 ; i<stones.length ; i++){
    var color = (i==active_stone) ? 'green' : '#990000' ;
    var cx = sw + (stones[i][0]+0.5)*sw ;
    var cy = sh + (stones[i][1]+0.5)*sh ;
    var r = Math.min(sw,sh)*0.375 ;
    draw_stone(context, cx, cy, r, i+1, color) ;
  }
}
function draw_arrow(){
  if(last_move){
    context.beginPath() ;
    context.strokeStyle = 'green' ;
    context.fillStyle   = 'green' ;
    var x1 = sw + (last_move[0]+0.5)*sw ;
    var y1 = sh + (last_move[1]+0.5)*sh ;
    var x2 = sw + (last_move[2]+0.5)*sw ;
    var y2 = sh + (last_move[3]+0.5)*sh ;
    if(Math.abs(x1-x2)<1e-6){
      y2 = (y2>y1) ? y2-0.5*sh : y2+0.5*sh ;
    }
    else{
      x2 = (x2>x1) ? x2-0.5*sw : x2+0.5*sw ;
    }
    context.moveTo(x1,y1) ;
    context.lineTo(x2,y2) ;
    context.stroke() ;
    context.beginPath() ;
    context.arc(x2,y2,0.05*sw,0,2*Math.PI,true) ;
    context.fill() ;
  }
}

function move_stone(dir){
  var s = stones[active_stone] ;
  var u = s[0] ;
  var v = s[1] ;
  switch(dir){
    case 0: // North
      while(v>0){
        if(cells[u][v-1]!=0) break ;
        var escape = false ;
        for(var i=0 ; i<stones.length ; i++){
          if(stones[i][0]==u && stones[i][1]==v-1) escape = true ;
        }
        if(escape) break ;
        v-- ;
      }
      break ;
    case 1: // East
      while(u<nCol-1){
        if(cells[u+1][v]!=0) break ;
        var escape = false ;
        for(var i=0 ; i<stones.length ; i++){
          if(stones[i][0]==u+1 && stones[i][1]==v) escape = true ;
        }
        if(escape) break ;
        u++ ;
      }
      break ;
    case 2: // South
      while(v<nRow-1){
        if(cells[u][v+1]!=0) break ;
        var escape = false ;
        for(var i=0 ; i<stones.length ; i++){
          if(stones[i][0]==u && stones[i][1]==v+1) escape = true ;
        }
        if(escape) break ;
        v++ ;
      }
      break ;
    case 3: // West
      while(u>0){
        if(cells[u-1][v]!=0) break ;
        var escape = false ;
        for(var i=0 ; i<stones.length ; i++){
          if(stones[i][0]==u-1 && stones[i][1]==v) escape = true ;
        }
        if(escape) break ;
        u-- ;
      }
      break ;
  }
  last_move = [ s[0] , s[1] , u , v ] ;
  stones[active_stone] = [u,v] ;
  if(s[0]==u && s[1]==v) return true ;
  return false ;
}
function check_solution(){
  for(var i=0 ; i<stones.length ; i++){
    var s = stones[i] ;
    if(s[0]==target[0] && s[1]==target[1]) return true ;
  }
  return false ;
}
function cycle_stone(){
  active_stone = (active_stone+1)%stones.length ;
}

function user_autosolve(){
  nMoves = 1 ;
  clear_progress_table() ;
  populate_blocks() ;
  autosolve() ;
}
function autosolve(){
  if(already_solved) return ;
  carryover = 4*stones.length ;
  nPaths = Math.pow(carryover,nMoves) ;
  nSprints = Math.ceil(nPaths/steps_per_sprint) ;
  if(Get('tr_progress_'+nMoves)==null){
    add_progress_row(nMoves) ;
    exhausted = false ;
    path = [] ;
    for(var i=0 ; i<nMoves ; i++){ path.push(0) ; }
  }
  if(nMoves>14) return ;
  kill = false ;
  counter = 0 ;
  sprint_counter++ ;
  while(success==false && exhausted==false && counter<steps_per_sprint && kill==false){
    var skip = try_path() ;
    if(skip>=0){
      increment_path(carryover, skip) ;
      for(var i=skip+1 ; i<path.length ; i++){
        path[i] = 0 ;
      }
      if(skip==-2){
        break ;
      }
    }
    if(check_solution()) success = true ;
    if(success==false){
      exhausted = increment_path(carryover, path.length-1) ;
    }
    counter++ ;
  }
  if(success){
    already_solved = true ;
    solution = path ;
    
    var progress = 0 ;
    for(var i=0 ; i<nMoves ; i++){
      progress += path[i]*Math.pow(carryover,nMoves-i-1) ;
    }
    var percent = 100*progress/nPaths ;
    
    Get('div_progress_bar_'   +nMoves).style.width = Math.floor(4.5*percent) + 'px' ;
    Get('td_progress_percent_'+nMoves).innerHTML   = percent.toFixed(2) + '%' ;
    Get('td_progress_done_'+nMoves).innerHTML = 'Done' ;
    Get('td_progress_done_'+nMoves).className = 'progress_done progress_done2' ;
    write_path() ;
    animate() ;
    return ;
  }
  var progress = 0 ;
  for(var i=0 ; i<nMoves ; i++){
    progress += path[i]*Math.pow(carryover,nMoves-i-1) ;
  }
  var percent = 100*progress/nPaths ;
  if(percent>100){
    exhausted = true ;
    percent = 100 ;
  }
  Get('div_progress_bar_'   +nMoves).style.width = Math.floor(4.5*percent) + 'px' ;
  Get('td_progress_percent_'+nMoves).innerHTML   = percent.toFixed(2) + '%' ;
  
  if(exhausted){
    Get('td_progress_done_'+nMoves).innerHTML = 'Done' ;
    Get('td_progress_done_'+nMoves).className = 'progress_done progress_done2' ;
    nMoves++ ;
  }
  window.setTimeout("autosolve()", 25) ;
}
function increment_path(carryover, position){
  path[position]++ ;
  return carry_index_up(position, carryover) ;
}
function carry_index_up(position, carryover){
  if(position==0 && path[0]==carryover) return true ;
  if(path[position]==carryover){
    path[position] = 0 ;
    path[position-1]++ ;
    return carry_index_up(position-1, carryover) ;
  }
  return false ;
}

function clear_progress_table(){
  var tbody = Get('tbody_progress') ;
  while(tbody.firstChild){ tbody.removeChild(tbody.firstChild) ; }
  var nMoves = 1 ;
}
function add_progress_row(n){
  var tbody = Get('tbody_progress') ;
  var tr = document.createElement('tr') ;
  tr.id = 'tr_progress_'+n ;
  
  var th = document.createElement('th') ;
  th.className = 'progress' ;
  th.innerHTML = n + ' moves' ;
  if(n==1) th.innerHTML = n + ' move' ;
  tr.appendChild(th) ;
  
  var td = document.createElement('td') ;
  td.className = 'progress_percent' ;
  td.id = 'td_progress_percent_'+n ;
  tr.appendChild(td) ;
  
  td = document.createElement('td') ;
  td.className = 'progress_bar' ;
  td.id = 'td_progress_bar_'+n ;
  var div = document.createElement('div') ;
  div.id = 'div_progress_bar_'+n ;
  div.innerHTML = '&nbsp;' ;
  div.className = 'progress_bar' ;
  td.appendChild(div) ;
  tr.appendChild(td) ;
  
  td = document.createElement('td') ;
  td.className = 'progress_done progress_done1' ;
  td.id = 'td_progress_done_'+n ;
  tr.appendChild(td) ;
  
  tbody.appendChild(tr) ;
}

function try_path(){
  for(var i=0 ; i<stones_0.length ; i++){
    stones[i] = stones_0[i] ;
  }
  for(var i=0 ; i<path.length ; i++){
    active_stone = Math.floor(path[i]/4) ;
    if(active_stone>=stones.length) return -2 ;
    var dir = path[i]%4 ;
    if(move_stone(dir)) return i ;
  }
  return -1 ;
}
function write_path(){
  var tbody = Get('tbody_solution') ;
  for(var i=0 ; i<path.length ; i++){
    var stone_index = Math.floor(path[i]/4) ;
    var dir = path[i]%4 ;
    var dir_texts = ['North','East','South','West'] ;
    
    var tr = document.createElement('tr') ;
    var th = document.createElement('th') ;
    th.className = 'solution' ;
    th.innerHTML = 'Step ' + (i+1) ;
    tr.appendChild(th) ;
    
    var td = document.createElement('td') ;
    td.className = 'solution' ;
    td.innerHTML = 'Move stone ' + (stone_index+1) + ' to the ' + dir_texts[dir] ;
    tr.appendChild(td) ;
    tbody.appendChild(tr) ;
  }
}

function animate(){
  if(kill) return ;
  for(var i=0 ; i<stones_0.length ; i++){
    stones[i] = stones_0[i] ;
  }
  draw_all() ;
  var path = solution ;
  for(var i=0 ; i<path.length ; i++){
    var stone_index = Math.floor(path[i]/4) ;
    var dir = path[i]%4 ;
    window.setTimeout('take_step('+stone_index+','+dir+')', delay*(i+1)) ;
  }
  window.setTimeout('animate()', delay*(path.length+5)) ;
}
function take_step(stone_index,dir){
  if(kill) return ;
  active_stone = stone_index ;
  move_stone(dir) ;
  draw_all() ;
  draw_arrow() ;
}
