export const contactApp = {
	id: 'app-contact',
	title: {'en-US':'Contact', 'fr-FR':'Contact'},
	version: '1.0.0',
	icon: `<svg viewBox="0 0 24 24"><path d="M20,4H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5l-8-5V6l8,5l8-5V8z" /></svg>`,
	iconColor: '#f44336',
	type: 'main',
	style: `
		/* --- Styles Contact --- */
		#contact-form {
			display: flex;
			flex-direction: column;
		}

		#mail-info {
			padding-top: 8px;
		}

		.form-group {
			margin-bottom: 15px;
		}

		.form-group label {
			display: block;
			margin-bottom: 5px;
			color: #616161;
			font-weight: 500;
		}

		.form-group input,
		.form-group textarea {
			width: 100%;
			padding: 12px;
			border: 1px solid #ddd;
			border-radius: 8px;
			font-family: 'Roboto', sans-serif;
			font-size: 1em;
			box-sizing: border-box;
		}

		.form-group textarea {
			resize: vertical;
			min-height: 100px;
		}

		#contact-form button {
			font-family: 'Undertale', 'Roboto', sans-serif;
			background-color: var(--accent-color);
			color: white;
			border: none;
			padding: 15px;
			border-radius: 8px;
			font-size: 1.1em;
			font-weight: 500;
			cursor: pointer;
			transition: background-color 0.2s ease;
		}

		#contact-form button:hover {
			background-color: #2962ff;
		}

		#submission-message {
			display: none;
			margin-top: 15px;
			padding: 10px;
			background-color: #d1f3d1;
			color: #114e11;
			border: 1px solid #a8e0a8;
			border-radius: 8px;
		}`,
	content: {
		'en-US': `
			<h1>Envoyez-moi un message</h1>
			<p id="mail-info" style="text-align: center; margin-top: -10px; margin-bottom: 20px;">Ou par email à <a href="mailto:clement.charriere@free.fr">clement.charriere@free.fr</a></p>
			<form id="contact-form">
				<div class="form-group">
					<label for="name">Nom</label>
					<input type="text" id="name" name="name" required>
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" name="email" required>
				</div>
				<div class="form-group">
					<label for="message">Message</label>
					<textarea id="message" name="message" required></textarea>
				</div>
				<button type="submit">Send</button>
			</form>
			<div id="submission-message">Your message has been sent successfully! Thank you.</div>
		`,
		'fr-FR': `
			<h1>Envoyez-moi un message</h1>
			<p id="mail-info" style="text-align: center; margin-top: -10px; margin-bottom: 20px;">Ou par email à <a href="mailto:clement.charriere@free.fr">clement.charriere@free.fr</a></p>
			<form id="contact-form">
				<div class="form-group">
					<label for="name">Nom</label>
					<input type="text" id="name" name="name" required>
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" name="email" required>
				</div>
				<div class="form-group">
					<label for="message">Message</label>
					<textarea id="message" name="message" required></textarea>
				</div>
				<button type="submit">Envoyer</button>
			</form>
			<div id="submission-message">Votre message a bien été envoyé ! Merci.</div>
		`
	},
	/**
	 * Init function
	 * @param {System} sys - System class instance
	 * @param {String} windowId - Window html ID in which the application will be drawn
	 */
	init: function (sys, windowId) {
        /** @type {System} */
		const system = sys;
        /** @type {JQuery<HTMLElement>} */
        const $window = $(`#${windowId}`);

        /** @type {JQuery<HTMLElement>} */
		const $form = $window.find('#contact-form');
        /** @type {JQuery<HTMLElement>} */
		const $successMessage = $window.find('#submission-message');

		$form.on('submit', function(e) {
			e.preventDefault();
			
			// Simuler l'envoi
			$form.hide();
			$successMessage.show();

			setTimeout(() => {
				$successMessage.hide();
				$form.show();
				$form[0].reset();
			}, 4000);
		});
		
		// expose API
		return { pause: () => { }, resume: () => { }, restart: () => { } };
	}
};
