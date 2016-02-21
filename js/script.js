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

  world.on('step', function() {
    world.render();
  });

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

  var ball = Physics.body('circle', {
    x: 5
    ,y: 0
    ,radius: 20
    ,vx: 0.2
    ,vy: 0.4
    ,restitution: 1.9
  });

  // Recalculate the bounds when the window is resized
  window.addEventListener('resize', function() {
    viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
    edgeBounce.setAABB(viewportBounds);
  }, true);


  // render on each step
  world.on('step', function(){
    // this.state.angular.pos += .02;
    world.render();
  });

  // Add behaviors to the world
  world.add([
    // Make objects bounce off canvas bounds
    Physics.behavior('body-impulse-response'),
    // Add Gravity to pull objects downward
    Physics.behavior('constant-acceleration'),
    // Make bodies bounce off each other
    Physics.behavior('body-collision-detection'),
    Physics.behavior('sweep-prune')
  ]);

  // Handle click events
  $('#dropperSpace').click(function(e){
    // checking canvas coordinates for the mouse click
    var offset = $(this).offset();
    var px = e.pageX - offset.left;
    var py = e.pageY - offset.top;

    // this is the way physicsjs handles 2d vectors, similar at Box2D's b2Vec
    var mousePos = Physics.vector();
    mousePos.set(px,py);
    // finding a body under mouse position

    var body = world.findOne({
      $at: mousePos
    })

    // there isn't any body under mouse position, going to create a new box
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

  // subscribe to ticker to advance the simulation
  Physics.util.ticker.on(function( time, dt ){
      world.step( time );
  });

  // start the ticker
  Physics.util.ticker.start();
});
