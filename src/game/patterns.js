(function(game) {

  var Patterns = game.Patterns = [];

  function charCode(char) {
    return char.charCodeAt(0);
  }

  function fillPattern(commands) {
    return function(ctx) {
      commands(ctx);
    };
  }

  function strokePattern(width, commands) {
    return function(ctx) {
      ctx.lineWidth = width;
      ctx.beginPath();

      commands(ctx);

      ctx.stroke();
      ctx.closePath();
    };
  }

  Patterns[charCode('═')] = strokePattern(2, function(ctx) {
    ctx.moveTo(0, 5);
    ctx.lineTo(10, 5);
  });

  Patterns[charCode('║')] = strokePattern(2, function(ctx) {
    ctx.moveTo(5, 0);
    ctx.lineTo(5, 10);
  });

  Patterns[charCode('╔')] = strokePattern(2, function(ctx) {
    ctx.moveTo(5, 10);
    ctx.lineTo(5, 5);
    ctx.lineTo(10, 5);
  });

  Patterns[charCode('╗')] = strokePattern(2, function(ctx) {
    ctx.moveTo(0, 5);
    ctx.lineTo(5, 5);
    ctx.lineTo(5, 10);
  });

  Patterns[charCode('╚')] = strokePattern(2, function(ctx) {
    ctx.moveTo(5, 0);
    ctx.lineTo(5, 5);
    ctx.lineTo(10, 5);
  });

  Patterns[charCode('╝')] = strokePattern(2, function(ctx) {
    ctx.moveTo(0, 5);
    ctx.lineTo(5, 5);
    ctx.lineTo(5, 0);
  });

  Patterns[charCode('╬')] = strokePattern(2, function(ctx) {
    ctx.moveTo(0, 5);
    ctx.lineTo(10, 5);
    ctx.moveTo(5, 0);
    ctx.lineTo(5, 10);
  });

  Patterns[charCode('╠')] = strokePattern(2, function(ctx) {
    ctx.moveTo(5, 0);
    ctx.lineTo(5, 10);
    ctx.moveTo(5, 5);
    ctx.lineTo(10, 5);
  });

  Patterns[charCode('╣')] = strokePattern(2, function(ctx) {
    ctx.moveTo(5, 0);
    ctx.lineTo(5, 10);
    ctx.moveTo(0, 5);
    ctx.lineTo(5, 5);
  });

  Patterns[charCode('╦')] = strokePattern(2, function(ctx) {
    ctx.moveTo(0, 5);
    ctx.lineTo(10, 5);
    ctx.moveTo(5, 5);
    ctx.lineTo(5, 10);
  });

  Patterns[charCode('╩')] = strokePattern(2, function(ctx) {
    ctx.moveTo(0, 5);
    ctx.lineTo(10, 5);
    ctx.moveTo(5, 5);
    ctx.lineTo(5, 0);
  });

  Patterns[charCode('░')] = fillPattern(function(ctx) {
    for (var i = 100; i--;) {
      var x = i % 10;
      var y = i / 10 | 0;

      if (((y & 1) === 0) != (x & 1)) {
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });

  Patterns[charCode('▓')] = fillPattern(function(ctx) {
    ctx.fillRect(0, 0, 10, 10);

    for (var i = 100; i--;) {
      var x = i % 10;
      var y = i / 10 | 0;

      if (!(x & 1)) {
        if (x % 4 === 0 && (y & 1) || x % 4 !== 0 && !(y & 1)) {
          ctx.clearRect(x, y, 1, 1);
        }
      }
    }
  });

})(game);

