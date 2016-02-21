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

  // var pentagon = Physics.body('convex-polygon', {
  //     // place the centroid of the polygon at (300, 200)
  //     x: 300,
  //     y: 200,
  //     // the centroid is automatically calculated and used to position the shape
  //     vertices: [
  //         { x: 0, y: -30 },
  //         { x: -29, y: -9 },
  //         { x: -18, y: 24 },
  //         { x: 18, y: 24 },
  //         { x: 29, y: -9 }
  //     ]
  // });
  var polygon = Physics.body('convex-polygon', {
    vertices: [
                { x: 100, y: 0 },
                { x: 50, y: -50 },
                { x: -50, y: -50 },
                { x: -100, y: 0 },
                { x: 0, y: 100 }
              ]
            });
  // world.add(polygon);

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

  // var box = Physics.body('rectangle',{
  //   x: viewWidth/2
  //   ,y: viewHeight/2
  //   ,width: viewWidth
  //   ,height: viewHeight
  // });
  // world.add(box);

  var vector = Physics.vector(3, 4);

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
        ,vx: 0.2
        ,vy: -0.3
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
