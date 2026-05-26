const STRINGS = {
	'en-US': {
		heading: 'Send me a message',
		byEmail: 'Or by email at',
		labelName: 'Name',
		labelEmail: 'Email',
		labelMessage: 'Message',
		send: 'Send',
		success: 'Your message has been sent successfully! Thank you.',
	},
	'fr-FR': {
		heading: 'Envoyez-moi un message',
		byEmail: 'Ou par email à',
		labelName: 'Nom',
		labelEmail: 'Email',
		labelMessage: 'Message',
		send: 'Envoyer',
		success: 'Votre message a bien été envoyé ! Merci.',
	},
};

function html(s) {
	return `
		<h1>${s.heading}</h1>
		<p id="mail-info">${s.byEmail} <a href="mailto:clement.charriere@free.fr">clement.charriere@free.fr</a></p>
		<form id="contact-form">
			<div class="form-group">
				<label for="contact-name">${s.labelName}</label>
				<input type="text" id="contact-name" name="name" required>
			</div>
			<div class="form-group">
				<label for="contact-email">${s.labelEmail}</label>
				<input type="email" id="contact-email" name="email" required>
			</div>
			<div class="form-group">
				<label for="contact-message">${s.labelMessage}</label>
				<textarea id="contact-message" name="message" required></textarea>
			</div>
			<button type="submit">${s.send}</button>
		</form>
		<div id="submission-message">${s.success}</div>
	`;
}

export const contactApp = {
	id: 'app-contact',
	title: { 'en-US': 'Contact', 'fr-FR': 'Contact' },
	version: '1.1.0',
	icon: `<svg viewBox="0 0 24 24"><path d="M20,4H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,8l-8,5l-8-5V6l8,5l8-5V8z" /></svg>`,
	iconColor: '#f44336',
	type: 'main',
	style: `
		#contact-form { display: flex; flex-direction: column; }
		#mail-info { padding-top: 8px; text-align: center; margin-top: -10px; margin-bottom: 20px; }
		.form-group { margin-bottom: 15px; }
		.form-group label { display: block; margin-bottom: 5px; color: #616161; font-weight: 500; }
		.form-group input,
		.form-group textarea {
			width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;
			font-family: 'Roboto', sans-serif; font-size: 1em; box-sizing: border-box;
		}
		.form-group textarea { resize: vertical; min-height: 100px; }
		#contact-form button {
			font-family: 'Undertale', 'Roboto', sans-serif;
			background-color: var(--accent-color); color: white; border: none;
			padding: 15px; border-radius: 8px; font-size: 1.1em; font-weight: 500;
			cursor: pointer; transition: background-color 0.2s ease;
		}
		#contact-form button:hover { background-color: #2962ff; }
		#submission-message {
			display: none; margin-top: 15px; padding: 10px;
			background-color: #d1f3d1; color: #114e11;
			border: 1px solid #a8e0a8; border-radius: 8px;
		}
	`,
	content: { 'en-US': html(STRINGS['en-US']), 'fr-FR': html(STRINGS['fr-FR']) },

	onMount(ctx) {
		const form = ctx.$('#contact-form');
		const msg  = ctx.$('#submission-message');
		if (!form || !msg) return;

		ctx.scope.on(form, 'submit', (e) => {
			e.preventDefault();
			// Submission is simulated — there's no backend. We just acknowledge
			// the user and reset the form after a delay.
			form.style.display = 'none';
			msg.style.display = 'block';
			ctx.scope.setTimeout(() => {
				msg.style.display = 'none';
				form.style.display = 'flex';
				form.reset();
			}, 4000);
		});
	}
};
