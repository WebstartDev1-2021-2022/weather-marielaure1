<!DOCTYPE html>
<html lang="fr-FR">
    <head>
        <title>Document</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Une description de la page" />
        <link rel="manifest" href="manifest.webmanifest">
        <link rel="shortcut icon" href="./img/icon-vector.jpg">
        <link rel="stylesheet" href="./css/reset.css" />
        <link rel="stylesheet" href="./css/style.css" />
        <script src="./js/main.js" defer></script>
    </head>
    <body>
        <h1>Weather</h1>

        <main>
            <section class="chargement">
                <img src="./img/icon-chargement.svg" alt="">
                <p>Veuillez autoriser l'accès <br>à votre position.</p>
            </section>
        </main>

        <?php 
            
            if(isset($_GET['search']) && !empty($_GET['search'])){
                $search = $_GET['search'];
            } else {
                $search = "";
            }
            
        ?>

        <template>
            <section class="now">
                <h2 class="city"></h2>
                <img class="now-icon" src="#" alt="">
                <div class="search">
                    <form method="GET" class="search-bar">
                        <input type="search" name="search" class="search-value" value="<?= $search ?>">
                        <button type="submit" class="search-submit">
                            <img class="icon-search" src="./img/icon-search.png" alt="search icon">
                        </button>
                    </form>
                </div>
                <div class="now-infos">
                    <p class="description"></p>
                    <p class="temperature"></p>
                </div>
                <img src="./img/icon-down-arrow.png" alt="" class="down-arrow">
            </section>

            <section class="hours-days">
                <div class="hours">
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                    <div class="hour"></div>
                </div>

                <div class="days">
                    <div class="day"></div>
                    <div class="day"></div>
                    <div class="day"></div>
                    <div class="day"></div>
                    <div class="day"></div>
                    <div class="day"></div>
                    <div class="day"></div>
                </div>
            </section>

            <!-- pour éviter le texte flouté -->
            <div class="bg-blur"></div>
        </template>




    </body>
</html>