var images = [
    'images/bee.jpg',
    'images/bird.png',
    'images/cow.jpg',
    'images/fox.jpg',
    'images/frog.png',
    'images/owl.jpg',
    'images/penguin.png',
    'images/snail.png'
];

function startGame() {
    $('#gameboard').empty();

    var tileImages = [];
    var openedTiles = [];

    for (var i = 0; i < images.length; i++) {
        tileImages.push(images[i]);
        tileImages.push(images[i]);
    }

    tileImages = _.shuffle(tileImages);

    for (var i = 0; i < tileImages.length; i++) {
        var tile = '<div class="card"></div>';
        $('#gameboard').append(tile);
    }

    $('#gameboard .card').click(function (event) {
        if (openedTiles.length >= 2 || $(this).hasClass('opened')) {
            return;
        }

        var index = $(this).index();

        var image = tileImages[index];
        $(this).css('background-image', 'url(' + image + ')');
        $(this).addClass('opened');

        openedTiles.push(index);

        if (openedTiles.length === 2) {
            var index1 = openedTiles[0];
            var index2 = openedTiles[1];
            if (tileImages[index1] === tileImages[index2]) {
                console.log("pildid samad");
            } else {
                console.log("erinevad");
                setTimeout(function() {
                    var tile1 = $("#gameboard .card").eq(index1);
                    var tile2 = $("#gameboard .card").eq(index2);

                    tile1.css('background-image', '').removeClass('opened');
                    tile2.css('background-image', '').removeClass('opened');
                }, 500);
            }
            openedTiles = [];
        }
    });
}

startGame();
$('#start').click(startGame);
