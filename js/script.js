Physics(function(world){

  // Renderer
  var viewWidth = 640;
  var viewHeight = 480;
  var renderer = Physics.renderer('canvas', {
    el: 'dropperSpace'
    ,width: viewWidth
    ,height: viewHeight
    ,meta: false		// setting it to "true" will display FPS
  });
  world.add(renderer);
  world.on('step', function(){
    world.render();
  });

  // Recalculate the bounds when the window is resized
  window.addEventListener('resize', function() {
    viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
    edgeBounce.setAABB(viewportBounds);
  }, true);

  // Behaviors
  var gravity = Physics.behavior('constant-acceleration');
  var edgeBounce = Physics.behavior('edge-collision-detection', {
    aabb: Physics.aabb(0, 0, viewWidth, viewHeight)
    ,restitution: 0.3
  });
  var bodyBounce = [ Physics.behavior('body-impulse-response')
                    ,Physics.behavior('body-collision-detection')
                    ,Physics.behavior('sweep-prune')];
  world.add(gravity);
  world.add(edgeBounce);
  world.add(bodyBounce);

  // Balls
  var ball = Physics.body('circle', {
    radius: 20
    ,restitution: 1.9
  });

  // Add a ball where the mouse is clicked
  $('#dropperSpace').click(function(e){
    var offset = $(this).offset();
    var px = e.pageX - offset.left;
    var py = e.pageY - offset.top;
    var mousePos = Physics.vector();

    mousePos.set(px,py);
    var body = world.findOne({
      $at: mousePos
    })

    if(!body){
      world.add(Physics.body('circle', {
        x: px
        ,y: py
        ,radius: 20
        ,restitution: 1.9
      }));
    } else {
      // If there is a body under the mouse, remove it
      world.removeBody(body);
    }
  });

  // Subscribe to ticker to advance the simulation
  Physics.util.ticker.on(function( time, dt ){
      world.step( time );
  });

  // Start the ticker
  Physics.util.ticker.start();
});
