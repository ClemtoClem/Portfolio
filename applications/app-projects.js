export const projectsApp = {
    id: 'projects-page',
    title: 'Projets',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,6H2v14c0,1.1,0.9,2,2,2h14v-2H4V6z M20,2H8C6.9,2,6,2.9,6,4v12c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M12,14.5v-9l6,4.5L12,14.5z" /></svg>`,
    iconColor: '#ff9800',
    type: 'main',
    content: `
        <!-- Vue Grille des Projets -->
        <div id="projects-grid">
            <div class="project-card" data-project="1">
                <img src="../img/polyadventure-capture.png" alt="PolyAdventure">
                <div class="project-card-title">PolyAdventure</div>
            </div>
            <div class="project-card" data-project="2">
                <img src="../img/red-pitaya.png" alt="Red Pitaya">
                <div class="project-card-title">Red Pitaya</div>
            </div>
            <div class="project-card" data-project="3">
                <img src="../img/holonome-robot-capture1.png" alt="Robot Holonome">
                <div class="project-card-title">Robot Holonome</div>
            </div>
            <div class="project-card" data-project="4">
                <img src="../img/batspy_logo.jpg" alt="Gite Chauves-souris">
                <div class="project-card-title">Gite Chauves-souris</div>
            </div>
        </div>

        <!-- Vues Détails des Projets (cachées) -->
        <div id="project-detail-1" class="project-detail-view">
            <a class="back-to-grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg> Retour</a>
            <img src="../img/polyadventure-capture.png" alt="PolyAdventure">
            <h3>PolyAdventure</h3>
            <div class="project-tags"><span class="tag">C</span><span class="tag">SDL3</span><span class="tag">Jeu 2D</span></div>
            <p>Ce projet, réalisé en 6 semaines à Polytech Grenoble, consistait à créer une application en C. Mon groupe de 5, que j'ai managé, a décidé de développer un jeu de plateau 2D. Pour assurer la meilleure portabilité, j'ai choisi d'utiliser la librairie graphique SDL3. Le jeu, "PolyAdventure", s'inspire des anciens jeux Pokémon, mais avec une plus grande liberté de mouvement.</p>
            <p>J'ai occupé le rôle de lead programmer, développant l'entièreté du moteur du jeu. Pour permettre à mes camarades moins expérimentés de contribuer, j'ai mis en place un système de fichiers de configuration pour paramétrer le jeu, interconnecter les maps et positionner les entités sans avoir à recompiler le code.</p>
        </div>
        <div id="project-detail-2" class="project-detail-view">
            <a class="back-to-grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg> Retour</a>
            <img src="../img/red-pitaya.png" alt="Red Pitaya">
            <h3>Red Pitaya</h3>
            <div class="project-tags"><span class="tag">C/C++</span><span class="tag">Traitement du Signal</span><span class="tag">Embarqué</span></div>
            <p>Programmation d'un système universel de mesures des figures de mérites d'un capteur MEMS sur la plateforme Red Pitaya STEMlab 125-14.</p>
            <p>Le programme compilé directement sur la Red Pitaya, permet de déterminer graphiquement la fréquence de résonance et d'anti-résonance du dispositif mesuré. L'application démodule le signal de sortie du dispositif et le signal de référence d’excitation pour en déduire l'amplitude et la phase. Cette opération est répétée sur une plage de fréquences paramétrable. Le programme est écrit en C et C++ et utilise la bibliothèque de la Red Pitaya pour gérer ses périphériques hautes performances (ADC/DAC 125MHz, 14 bits).</p>
        </div>
        <div id="project-detail-3" class="project-detail-view">
            <a class="back-to-grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg> Retour</a>
            <img src="../img/holonome-robot-capture1.png" alt="Robot Holonome">
            <h3>Robot Holonome</h3>
            <div class="project-tags"><span class="tag">C</span><span class="tag">KiCad</span><span class="tag">Électronique</span></div>
            <p>Ce projet, réalisé à l'IUT1 de Grenoble, consistait à concevoir entièrement un petit robot autonome capable de se déplacer d'un point A à un point B dans un environnement inconnu. Pour une maniabilité optimale, j'ai opté pour un design avec trois roues holonomes.</p>
            <p>J'ai conçu la structure mécanique et sélectionné les composants. Pour l'électronique, j'ai réparti les fonctionnalités sur 7 cartes dédiées (alimentation, contrôle avec un PIC18F4431, puissance pour les moteurs, interface, capteurs, etc.), que j'ai conçues avec KiCad et fabriquées à l'IUT.</p>
        </div>
        <div id="project-detail-4" class="project-detail-view">
            <a class="back-to-grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,11H7.83l5.59-5.59L12,4l-8,8l8,8l1.41-1.41L7.83,13H20V11z" /></svg> Retour</a>
            <img src="../img/batspy_logo.jpg" alt="Gite Chauves-souris">
            <h3>Gîte à Chauves-souris Connecté</h3>
            <div class="project-tags"><span class="tag">C++</span><span class="tag">Arduino</span><span class="tag">IoT</span></div>
            <p>Ce projet universitaire consiste en la réalisation d'un gîte à chauves-souris équipé d'un système électronique. Le système a pour but de compter les entrées et sorties des chauves-souris et de mesurer les conditions environnementales internes, comme la température, l'humidité et la luminosité, afin d'étudier leur comportement.</p>
        </div>
    `,
    init: function(windowId) {
        // La portée est limitée à la fenêtre actuelle
        const $window = $(`#${windowId}`);
        const $grid = $window.find('#projects-grid');
        const $details = $window.find('.project-detail-view');

        // Ouvrir les détails
        $window.on('click', '.project-card', function() {
            const projectId = $(this).data('project');
            $grid.fadeOut(200, function() {
                $window.find('#project-detail-' + projectId).fadeIn(200);
            });
        });

        // Retourner à la grille
        $window.on('click', '.back-to-grid', function() {
            const $detailView = $(this).closest('.project-detail-view');
            $detailView.fadeOut(200, function() {
                $grid.fadeIn(200);
            });
        });
    }
};
