export const contactApp = {
	id: 'contact-page',
	title: 'Contact',
	icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20,4H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5l-8-5V6l8,5l8-5V8z" /></svg>`,
	iconColor: '#f44336',
	type: 'main',
	content: `
		<h3>Envoyez-moi un message</h3>
		<p style="text-align: center; margin-top: -10px; margin-bottom: 20px;">Ou par email à <a href="mailto:clement.charriere@free.fr">clement.charriere@free.fr</a></p>
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
	`,
	init: function(windowId) {
		const $window = $(`#${windowId}`);
		const $form = $window.find('#contact-form');
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
	}
};
