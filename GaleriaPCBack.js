        const mainContainer = document.getElementById('main-gif-container');
        const extraContainer = document.getElementById('extra-gif-container');
    
        // Lista de URLs de gifs (40 URLs diferentes para los 40 gifs)
        const gifUrls = [

            // GIRLS //

        ' https://i.postimg.cc/s2JrgTjH/Xat-Private-Rick-Ventas-GFX.gif ', // 1

        ' https://i.postimg.cc/7YTr2HP2/Xat-Private-Rick-Flash-GFX.gif ', // 2

        ' https://i.postimg.cc/6q7Myc8B/Xat-Private-Rick-Multi-GFX.gif ', // 3

        ' https://i.ibb.co/wNwn6yND/Xat-Private-Rick-Silver-GFX.gif ', // 4

        ' https://i.postimg.cc/vHqP2Dpy/Xat-Private-Rick-Ventas-FX.gif ', // 5

        ' https://i.postimg.cc/sgQdBV4V/Xat-Private-Angy-St-Valentines-FX.gif ', // 6

        ' https://i.postimg.cc/fRG4m68Y/Xat-Private-Autumn-Revenge-SFX.gif ',  // 7

        ' https://i.postimg.cc/7L8cfSLV/Xat-Box-Ayuda-Snowy-Xmas-GFX.gif ',  // 8

        ' https://i.postimg.cc/Gt2gZQMc/Xat-Private-Polar-Xmas-FX.gif ',  // 9

        ' https://i.postimg.cc/sgMkRgTM/Xat-Private-Sky-Xmas-FX.gif ',  // 10

        ' https://i.postimg.cc/mg9WjrfD/Xat-Private-Sky-Unicorn-GFX.gif ',  // 11

        ' https://i.postimg.cc/MKCVN94D/Xat-Private-Annye-Flowers-GFX.gif ',  // 12

        ' https://i.postimg.cc/sx4fN3NF/Xat-Private-Hello-Luisa-SFX.gif ',  // 13

        ' https://i.postimg.cc/0yzVTPsw/Xat-Private-Paola-Crema-GFX.gif ',  // 14

        ' https://i.postimg.cc/prpWNs1f/Xat-Private-Karime-Sky-FX.gif ',  // 15

            // BOYS //

        ' https://i.postimg.cc/WzpnXP8t/Xat-Private-Key-GFX.gif ',  // 16

        ' https://i.postimg.cc/dtFs9GK0/Xat-Private-Sky-Video-GFX.gif ',  // 17

        ' https://i.postimg.cc/fTwmV3dr/Xat-Private-Nihan-Blue-GFX.gif ',  // 18

        ' https://i.postimg.cc/MGcgD86R/Xat-Private-Nihan-Heart-GFX.gif ',  // 19

        ' https://i.postimg.cc/15ZXCSzt/Xat-Private-mor-Spring-FX.gif ',  // 20

        ' https://i.postimg.cc/W3Lgq5Bc/Xat-Private-Mikael-Square-GFX.gif ',  // 21

        ' https://i.postimg.cc/x1j81dPQ/Xat-Private-Candy-Green-GFX.gif ',  // 22

        ' https://i.postimg.cc/Pr2qxTLg/Xat-Private-Mikael-Red-GFX.gif ',  // 23

        ' https://i.postimg.cc/zGrxjpff/Xat-Private-Nihan-Silver-GFX.gif ',  // 24
            
        ' https://i.postimg.cc/zD2kJFt7/Xat-Private-Saints-Gear-GFX.gif ',  // 25

        ' https://i.postimg.cc/jSQxGsbM/Xat-Private-BellaHanni-GFX.gif ',  // 26

        ' https://i.postimg.cc/W1wZ2tfz/Xat-Private-Eluney-Aqua-GFX.gif ',  // 27

        ' https://i.postimg.cc/1RWxLJym/Xat-Private-Lala-Purple-GFX.gif ',  // 28

        ' https://i.postimg.cc/fTCm2nTm/Xat-Private-Lunna-Stars-GFX.gif ',  // 29

        ' https://i.postimg.cc/BbRWVypb/Xat-Private-Dulce-GFX.gif ',  // 30

        ];

        function createGifCard(index, gifUrl) {
            const card = document.createElement('div');
            card.classList.add('gif-card');
            card.innerHTML = `
                <div class="gif-inner">
                    <div class="gif-front">
                        <img src="${gifUrl}" alt="Gif ${index + 1}">
                    </div>
                    <div class="gif-back">
                        ${index + 1}
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
            return card;
        }

        // Generar 30 gifs para el contenedor principal (5x6)
        for (let i = 0; i < 15; i++) {
            mainContainer.appendChild(createGifCard(i, gifUrls[i]));
        }

        // Generar 10 gifs para el contenedor secundario (5x2)
        for (let i = 15; i < 30; i++) {
            extraContainer.appendChild(createGifCard(i, gifUrls[i]));
        }
/*
        const moreGirls = () => {
            parent.open("https://postimg.cc/gallery/qpWtjQz");
        }
        const moreBoys = () => {
            parent.open("https://postimg.cc/gallery/Mq650ZQ");
        } */
