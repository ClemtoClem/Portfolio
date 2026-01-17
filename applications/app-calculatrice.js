import { System } from '../system.js';
export const calculatriceApp = {
	id: 'app-calculatrice',
	title: {'en-US': 'Calculator', 'fr-FR':'Calculatrice'},
	version: '1.0.0',
	icon: `<svg viewBox="0 0 1024 1024" class="icon" version="1.1" fill="#000000"><g id="bgCarrier" stroke-width="0"></g><g id="tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="iconCarrier"><path d="M182.459627 15.900621h658.285715c12.720497 0 22.26087 10.335404 22.260869 22.26087v946.881987c0 12.720497-10.335404 22.26087-22.260869 22.26087H182.459627c-12.720497 0-22.26087-10.335404-22.260869-22.26087V38.161491C160.198758 26.236025 170.534161 15.900621 182.459627 15.900621z" fill="#7D8792"></path><path d="M841.540373 1024H182.459627c-21.465839 0-38.161491-17.490683-38.16149-38.161491V38.161491C144.298137 17.490683 161.78882 0 182.459627 0h658.285715c21.465839 0 38.161491 17.490683 38.16149 38.161491v946.881987c0.795031 21.465839-16.695652 38.956522-37.366459 38.956522zM182.459627 31.801242c-3.180124 0-6.360248 3.180124-6.360248 6.360249v946.881987c0 3.975155 3.180124 6.360248 6.360248 6.360249h658.285715c3.975155 0 6.360248-3.180124 6.360248-6.360249V38.161491c0-3.975155-3.180124-6.360248-6.360248-6.360249H182.459627z" fill="#000000"></path><path d="M254.012422 111.304348h512.795031v194.782609H254.012422z" fill="#BFEBFF"></path><path d="M782.708075 321.987578H238.111801V95.403727h544.596274v226.583851z m-512.795032-31.801243h480.993789V127.204969H269.913043v162.981366z" fill="#000000"></path><path d="M276.273292 401.490683h186.832298c12.720497 0 22.26087 10.335404 22.26087 22.26087v176.496894c0 12.720497-10.335404 22.26087-22.26087 22.26087H276.273292c-12.720497 0-22.26087-10.335404-22.26087-22.26087V423.751553c0-11.925466 9.540373-22.26087 22.26087-22.26087z" fill="#BEC9D4"></path><path d="M463.10559 638.409938H276.273292c-21.465839 0-38.161491-17.490683-38.161491-38.161491V423.751553c0-21.465839 17.490683-38.161491 38.161491-38.161491h186.832298c21.465839 0 38.161491 17.490683 38.161491 38.161491v176.496894c0 21.465839-16.695652 38.161491-38.161491 38.161491zM276.273292 417.391304c-3.975155 0-6.360248 3.180124-6.360249 6.360249v176.496894c0 3.975155 3.180124 6.360248 6.360249 6.360249h186.832298c3.975155 0 6.360248-3.180124 6.360249-6.360249V423.751553c0-3.975155-3.180124-6.360248-6.360249-6.360249H276.273292z" fill="#000000"></path><path d="M561.689441 401.490683H748.521739c12.720497 0 22.26087 10.335404 22.26087 22.26087v176.496894c0 12.720497-10.335404 22.26087-22.26087 22.26087H561.689441c-12.720497 0-22.26087-10.335404-22.26087-22.26087V423.751553c0-11.925466 9.540373-22.26087 22.26087-22.26087z" fill="#BEC9D4"></path><path d="M748.521739 638.409938H561.689441c-21.465839 0-38.161491-17.490683-38.161491-38.161491V423.751553c0-21.465839 17.490683-38.161491 38.161491-38.161491H748.521739c21.465839 0 38.161491 17.490683 38.161491 38.161491v176.496894c0 21.465839-16.695652 38.161491-38.161491 38.161491zM561.689441 417.391304c-3.975155 0-6.360248 3.180124-6.360248 6.360249v176.496894c0 3.975155 3.180124 6.360248 6.360248 6.360249H748.521739c3.975155 0 6.360248-3.180124 6.360249-6.360249V423.751553c0-3.975155-3.180124-6.360248-6.360249-6.360249H561.689441z" fill="#000000"></path><path d="M561.689441 686.111801H748.521739c12.720497 0 22.26087 10.335404 22.26087 22.26087v176.496894c0 12.720497-10.335404 22.26087-22.26087 22.26087H561.689441c-12.720497 0-22.26087-10.335404-22.26087-22.26087V708.372671c0-11.925466 9.540373-22.26087 22.26087-22.26087z" fill="#BEC9D4"></path><path d="M748.521739 923.031056H561.689441c-21.465839 0-38.161491-17.490683-38.161491-38.161491V708.372671c0-21.465839 17.490683-38.161491 38.161491-38.161491H748.521739c21.465839 0 38.161491 17.490683 38.161491 38.161491v176.496894c0 21.465839-16.695652 38.161491-38.161491 38.161491zM561.689441 702.012422c-3.975155 0-6.360248 3.180124-6.360248 6.360249v176.496894c0 3.975155 3.180124 6.360248 6.360248 6.360249H748.521739c3.975155 0 6.360248-3.180124 6.360249-6.360249V708.372671c0-3.975155-3.180124-6.360248-6.360249-6.360249H561.689441z" fill="#000000"></path><path d="M276.273292 686.111801h186.832298c12.720497 0 22.26087 10.335404 22.26087 22.26087v176.496894c0 12.720497-10.335404 22.26087-22.26087 22.26087H276.273292c-12.720497 0-22.26087-10.335404-22.26087-22.26087V708.372671c0-11.925466 9.540373-22.26087 22.26087-22.26087z" fill="#BEC9D4"></path><path d="M463.10559 923.031056H276.273292c-21.465839 0-38.161491-17.490683-38.161491-38.161491V708.372671c0-21.465839 17.490683-38.161491 38.161491-38.161491h186.832298c21.465839 0 38.161491 17.490683 38.161491 38.161491v176.496894c0 21.465839-16.695652 38.161491-38.161491 38.161491zM276.273292 702.012422c-3.975155 0-6.360248 3.180124-6.360249 6.360249v176.496894c0 3.975155 3.180124 6.360248 6.360249 6.360249h186.832298c3.975155 0 6.360248-3.180124 6.360249-6.360249V708.372671c0-3.975155-3.180124-6.360248-6.360249-6.360249H276.273292zM369.291925 578.782609c-8.745342 0-15.900621-7.15528-15.900621-15.900621V461.118012c0-8.745342 7.15528-15.900621 15.900621-15.900621s15.900621 7.15528 15.900622 15.900621v101.763976c0 8.745342-7.15528 15.900621-15.900622 15.900621z" fill="#000000"></path><path d="M418.583851 527.900621H321.590062c-8.745342 0-15.900621-7.15528-15.900621-15.900621s7.15528-15.900621 15.900621-15.900621h97.78882c8.745342 0 15.900621 7.15528 15.900621 15.900621s-7.950311 15.900621-16.695652 15.900621z" fill="#000000"></path><path d="M402.68323 847.503106c-3.975155 0-7.950311-1.590062-11.130435-4.770187l-69.167702-69.167702c-6.360248-6.360248-6.360248-15.900621 0-22.260869 6.360248-6.360248 15.900621-6.360248 22.26087 0l69.167702 69.167702c6.360248 6.360248 6.360248 15.900621 0 22.260869-2.385093 3.180124-7.15528 4.770186-11.130435 4.770187z" fill="#000000"></path><path d="M333.515528 847.503106c-3.975155 0-7.950311-1.590062-11.130435-4.770187-6.360248-6.360248-6.360248-15.900621 0-22.260869l69.167702-69.167702c6.360248-6.360248 15.900621-6.360248 22.26087 0 6.360248 6.360248 6.360248 15.900621 0 22.260869l-69.167702 69.167702c-3.180124 3.180124-7.15528 4.770186-11.130435 4.770187z" fill="#000000"></path><path d="M709.565217 527.900621H600.645963c-8.745342 0-15.900621-7.15528-15.900621-15.900621s7.15528-15.900621 15.900621-15.900621h109.714285c8.745342 0 15.900621 7.15528 15.900622 15.900621s-7.950311 15.900621-16.695653 15.900621z" fill="#000000"></path><path d="M709.565217 785.490683H600.645963c-8.745342 0-15.900621-7.15528-15.900621-15.900621s7.15528-15.900621 15.900621-15.900621h109.714285c8.745342 0 15.900621 7.15528 15.900622 15.900621s-7.950311 15.900621-16.695653 15.900621z" fill="#000000"></path><path d="M709.565217 847.503106H600.645963c-8.745342 0-15.900621-7.15528-15.900621-15.900622s7.15528-15.900621 15.900621-15.900621h109.714285c8.745342 0 15.900621 7.15528 15.900622 15.900621s-7.950311 15.900621-16.695653 15.900622z" fill="#000000"></path></g></svg>`,
	iconColor: '#BEC9D4',
	type: 'app',
	style: `
		.app-content { background: #BEC9D4; }
		.calculator { margin: 12px; color: white; }
		.display { background: #111827; padding: 12px; border-radius: 8px; margin-bottom: 8px; }
		#expression-input { width: 100%; background: transparent; border: none; outline: none; color: white; font-size: 1.25rem; }
		#result-display { text-align: right; font-size: 1.125rem; color: #9CA3AF; }
		.modes { display:flex; gap:8px; margin-bottom:8px; }
		.mode-button { color: white; background: #111827; border-style: none; padding: 6px; border-radius:8px; cursor:pointer; }
		.mode-button:hover { background: #2b3747ff; }
		.mode-button.active { background: #5b21b6; }
		.mode-button.active:hover { background: #6635b6ff; }
		.calculator-grid { color: white; display:grid; grid-template-columns: repeat(6, 1fr); gap:8px; }
		.calc-key { padding:12px; border-radius:8px; background: #111827; cursor:pointer; text-align:center; }
		.calc-key:hover { background: #2b3747ff; }
		.calc-key.disabled { opacity:0.35; cursor:not-allowed; }
		#autocomplete-suggestions { position: absolute; background:#0f172a; border:1px solid #334155; border-radius:6px; max-height:220px; overflow:auto; min-width:260px; display:none; z-index:2000; }
		.suggestion-item { color: white; padding:8px 10px; cursor:pointer; }
		.suggestion-item:hover { background: #111827; }
		.invalid-function { color:#ef4444 !important; }
		.doc-modal { position:fixed; inset:0; background:rgba(2,6,23,0.6); display:flex; align-items:center; justify-content:center; z-index:3000; }
		.doc-modal b { background: #2183d3ff; }
		.doc-panel { width: min(900px, 96%); max-height:80vh; overflow:auto; background: #0b1220; padding:16px; border-radius:10px; }
		.hidden { display:none !important; }
		.bases { display:flex; gap:12px; align-items:center; }
		.base-btn { color: white; border-style: none; padding:6px 10px; border-radius:6px; cursor:pointer; background: #1f2937; }
		.base-btn:hover { background:#2b3747ff; }
		.base-btn.active { background:#5b21b6; }
		.doc-entry { margin-bottom:8px; border-radius:6px; padding:8px; background:#071126; }
		#doc-close-btn { background: #303a4eff; }
		#doc-close-btn:hover { background: #45536eff; }
		.key-num { background: #0f4386ff; }
		.key-num:hover { background: #295286ff; }
		.key-accent { background: #ea580c; }
		.key-accent:hover { background: #e97537ff; }
		.key-red { background: #b91c1c; }
		.key-red:hover { background: #b83c3cff; }
		.key-orange { background: #b45309; }
		.key-orange:hover { background: #b3662bff; }
		`,
	content: {
		'en-US': `
			<div class="calculator p-3" id="calculatrice-root">
				<div class="modes">
					<button class="mode-button" id="mode-normal" data-mode="normal">Normal</button>
					<button class="mode-button" id="mode-scientific" data-mode="scientific">Scientist</button>
					<button class="mode-button" id="mode-programmer" data-mode="programmer">Programmer</button>
					<button class="mode-button" id="doc-btn" title="Documentation">
						<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"><g id="bgCarrier" stroke-width="0"></g><g id="tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M23 4C23 3.11596 21.855 2.80151 21.0975 2.59348C21.0279 2.57437 20.9616 2.55615 20.8997 2.53848C19.9537 2.26818 18.6102 2 17 2C15.2762 2 13.8549 2.574 12.8789 3.13176C12.7296 3.21707 12.5726 3.33492 12.4307 3.44143C12.2433 3.58215 12.0823 3.70308 12 3.70308C11.9177 3.70308 11.7567 3.58215 11.5693 3.44143C11.4274 3.33492 11.2704 3.21707 11.1211 3.13176C10.1451 2.574 8.72378 2 7 2C5.38978 2 4.0463 2.26818 3.10028 2.53848C3.04079 2.55547 2.97705 2.57302 2.91016 2.59144C2.156 2.79911 1 3.11742 1 4V17C1 17.3466 1.17945 17.6684 1.47427 17.8507C1.94329 18.1405 2.56224 17.8868 3.11074 17.662C3.30209 17.5835 3.48487 17.5086 3.64972 17.4615C4.4537 17.2318 5.61022 17 7 17C8.2613 17 9.20554 17.4161 9.9134 17.8517C10.0952 17.9636 10.279 18.1063 10.4676 18.2527C10.9338 18.6148 11.4298 19 12 19C12.5718 19 13.0653 18.6162 13.5307 18.2543C13.7195 18.1074 13.9037 17.9642 14.0866 17.8517C14.7945 17.4161 15.7387 17 17 17C18.3898 17 19.5463 17.2318 20.3503 17.4615C20.5227 17.5108 20.7099 17.5898 20.9042 17.6719C21.4443 17.9 22.0393 18.1513 22.5257 17.8507C22.8205 17.6684 23 17.3466 23 17V4ZM3.33252 4.55749C3.13163 4.62161 3 4.81078 3 5.02166V14.8991C3 15.233 3.32089 15.4733 3.64547 15.3951C4.53577 15.1807 5.67777 15 7 15C8.76309 15 10.0794 15.5994 11 16.1721V5.45567C10.7989 5.29593 10.5037 5.08245 10.1289 4.86824C9.35493 4.426 8.27622 4 7 4C5.41509 4 4.12989 4.30297 3.33252 4.55749ZM17 15C15.2369 15 13.9206 15.5994 13 16.1721V5.45567C13.2011 5.29593 13.4963 5.08245 13.8711 4.86824C14.6451 4.426 15.7238 4 17 4C18.5849 4 19.8701 4.30297 20.6675 4.55749C20.8684 4.62161 21 4.81078 21 5.02166V14.8991C21 15.233 20.6791 15.4733 20.3545 15.3951C19.4642 15.1807 18.3222 15 17 15Z" fill="#ffffff"></path> <path d="M2.08735 20.4087C1.86161 19.9047 2.08723 19.3131 2.59127 19.0873C3.05951 18.8792 3.54426 18.7043 4.0318 18.5478C4.84068 18.2883 5.95911 18 7 18C8.16689 18 9.16285 18.6289 9.88469 19.0847C9.92174 19.1081 9.95807 19.131 9.99366 19.1534C10.8347 19.6821 11.4004 20 12 20C12.5989 20 13.1612 19.6829 14.0012 19.1538C14.0357 19.1321 14.0708 19.1099 14.1066 19.0872C14.8291 18.6303 15.8257 18 17 18C18.0465 18 19.1647 18.2881 19.9732 18.548C20.6992 18.7814 21.2378 19.0122 21.3762 19.073C21.8822 19.2968 22.1443 19.8943 21.9118 20.4105C21.6867 20.9106 21.0859 21.1325 20.5874 20.9109C20.1883 20.7349 19.7761 20.5855 19.361 20.452C18.6142 20.2119 17.7324 20 17 20C16.4409 20 15.9037 20.3186 15.0069 20.8841C14.2635 21.3529 13.2373 22 12 22C10.7619 22 9.73236 21.3521 8.98685 20.8829C8.08824 20.3173 7.55225 20 7 20C6.27378 20 5.39222 20.2117 4.64287 20.4522C4.22538 20.5861 3.80974 20.7351 3.4085 20.9128C2.9045 21.1383 2.31305 20.9127 2.08735 20.4087Z" fill="#ffffff"></path> </g></svg>
					</button>
				</div>
				<div class="bases hidden" id="base-display">
					<button class="base-btn key-base" data-base="2">BIN</button>
					<button class="base-btn key-base" data-base="8">OCT</button>
					<button class="base-btn key-base" data-base="10">DEC</button>
					<button class="base-btn key-base" data-base="16">HEX</button>
				</div>
			</div>

			<div class="display">
				<input id="expression-input" autocomplete="off" placeholder="0" />
				<div id="autocomplete-suggestions"></div>
				<div id="result-display"></div>
			</div>

			<div id="keypad" class="calculator-grid"></div>

				<div id="programmer-bases" class="mt-2 text-sm hidden">
					<div id="base-dec">DEC: 0</div>
					<div id="base-hex">HEX: 0</div>
					<div id="base-oct">OCT: 0</div>
					<div id="base-bin">BIN: 0</div>
				</div>
			</div>

			<!-- Documentation modal -->
			<div id="documentation-modal" class="doc-modal hidden">
				<div class="doc-panel">
					<div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
						<input id="doc-search-input" placeholder="Search for a function..." style="flex:1; padding:8px; border-radius:6px; background:#031022; border:1px solid #274060; color:#fff" />
						<button id="doc-close-btn" class="mode-button">Close</button>
					</div>
					<div id="doc-content"></div>
				</div>
			</div>
		`,
		'fr-FR': `
			<div class="calculator p-3" id="calculatrice-root">
				<div class="modes">
					<button class="mode-button" id="mode-normal" data-mode="normal">Normal</button>
					<button class="mode-button" id="mode-scientific" data-mode="scientific">Scientifique</button>
					<button class="mode-button" id="mode-programmer" data-mode="programmer">Programmeur</button>
					<button class="mode-button" id="doc-btn" title="Documentation">
						<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"><g id="bgCarrier" stroke-width="0"></g><g id="tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M23 4C23 3.11596 21.855 2.80151 21.0975 2.59348C21.0279 2.57437 20.9616 2.55615 20.8997 2.53848C19.9537 2.26818 18.6102 2 17 2C15.2762 2 13.8549 2.574 12.8789 3.13176C12.7296 3.21707 12.5726 3.33492 12.4307 3.44143C12.2433 3.58215 12.0823 3.70308 12 3.70308C11.9177 3.70308 11.7567 3.58215 11.5693 3.44143C11.4274 3.33492 11.2704 3.21707 11.1211 3.13176C10.1451 2.574 8.72378 2 7 2C5.38978 2 4.0463 2.26818 3.10028 2.53848C3.04079 2.55547 2.97705 2.57302 2.91016 2.59144C2.156 2.79911 1 3.11742 1 4V17C1 17.3466 1.17945 17.6684 1.47427 17.8507C1.94329 18.1405 2.56224 17.8868 3.11074 17.662C3.30209 17.5835 3.48487 17.5086 3.64972 17.4615C4.4537 17.2318 5.61022 17 7 17C8.2613 17 9.20554 17.4161 9.9134 17.8517C10.0952 17.9636 10.279 18.1063 10.4676 18.2527C10.9338 18.6148 11.4298 19 12 19C12.5718 19 13.0653 18.6162 13.5307 18.2543C13.7195 18.1074 13.9037 17.9642 14.0866 17.8517C14.7945 17.4161 15.7387 17 17 17C18.3898 17 19.5463 17.2318 20.3503 17.4615C20.5227 17.5108 20.7099 17.5898 20.9042 17.6719C21.4443 17.9 22.0393 18.1513 22.5257 17.8507C22.8205 17.6684 23 17.3466 23 17V4ZM3.33252 4.55749C3.13163 4.62161 3 4.81078 3 5.02166V14.8991C3 15.233 3.32089 15.4733 3.64547 15.3951C4.53577 15.1807 5.67777 15 7 15C8.76309 15 10.0794 15.5994 11 16.1721V5.45567C10.7989 5.29593 10.5037 5.08245 10.1289 4.86824C9.35493 4.426 8.27622 4 7 4C5.41509 4 4.12989 4.30297 3.33252 4.55749ZM17 15C15.2369 15 13.9206 15.5994 13 16.1721V5.45567C13.2011 5.29593 13.4963 5.08245 13.8711 4.86824C14.6451 4.426 15.7238 4 17 4C18.5849 4 19.8701 4.30297 20.6675 4.55749C20.8684 4.62161 21 4.81078 21 5.02166V14.8991C21 15.233 20.6791 15.4733 20.3545 15.3951C19.4642 15.1807 18.3222 15 17 15Z" fill="#ffffff"></path> <path d="M2.08735 20.4087C1.86161 19.9047 2.08723 19.3131 2.59127 19.0873C3.05951 18.8792 3.54426 18.7043 4.0318 18.5478C4.84068 18.2883 5.95911 18 7 18C8.16689 18 9.16285 18.6289 9.88469 19.0847C9.92174 19.1081 9.95807 19.131 9.99366 19.1534C10.8347 19.6821 11.4004 20 12 20C12.5989 20 13.1612 19.6829 14.0012 19.1538C14.0357 19.1321 14.0708 19.1099 14.1066 19.0872C14.8291 18.6303 15.8257 18 17 18C18.0465 18 19.1647 18.2881 19.9732 18.548C20.6992 18.7814 21.2378 19.0122 21.3762 19.073C21.8822 19.2968 22.1443 19.8943 21.9118 20.4105C21.6867 20.9106 21.0859 21.1325 20.5874 20.9109C20.1883 20.7349 19.7761 20.5855 19.361 20.452C18.6142 20.2119 17.7324 20 17 20C16.4409 20 15.9037 20.3186 15.0069 20.8841C14.2635 21.3529 13.2373 22 12 22C10.7619 22 9.73236 21.3521 8.98685 20.8829C8.08824 20.3173 7.55225 20 7 20C6.27378 20 5.39222 20.2117 4.64287 20.4522C4.22538 20.5861 3.80974 20.7351 3.4085 20.9128C2.9045 21.1383 2.31305 20.9127 2.08735 20.4087Z" fill="#ffffff"></path> </g></svg>
					</button>
				</div>
				<div class="bases hidden" id="base-display">
					<button class="base-btn key-base" data-base="2">BIN</button>
					<button class="base-btn key-base" data-base="8">OCT</button>
					<button class="base-btn key-base" data-base="10">DEC</button>
					<button class="base-btn key-base" data-base="16">HEX</button>
				</div>
			</div>

			<div class="display">
				<input id="expression-input" autocomplete="off" placeholder="0" />
				<div id="autocomplete-suggestions"></div>
				<div id="result-display"></div>
			</div>

			<div id="keypad" class="calculator-grid"></div>

				<div id="programmer-bases" class="mt-2 text-sm hidden">
					<div id="base-dec">DEC: 0</div>
					<div id="base-hex">HEX: 0</div>
					<div id="base-oct">OCT: 0</div>
					<div id="base-bin">BIN: 0</div>
				</div>
			</div>

			<!-- Documentation modal -->
			<div id="documentation-modal" class="doc-modal hidden">
				<div class="doc-panel">
					<div style="display:flex; gap:8px; align-items:center; margin-bottom:8px;">
						<input id="doc-search-input" placeholder="Rechercher une fonction..." style="flex:1; padding:8px; border-radius:6px; background:#031022; border:1px solid #274060; color:#fff" />
						<button id="doc-close-btn" class="mode-button">Fermer</button>
					</div>
					<div id="doc-content"></div>
				</div>
			</div>
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

		// -- Configuration des fonctions disponibles --
		const FUNCTIONS = {
			// Trigonométrie (note: handleTrig appliquera la conversion Deg/Rad si nécessaire)
			sin: { name: 'sin', desc: 'Sinus (x) — entrée en radians par défaut ou en degrés si mode Deg', args: 'x', cat: 'Trigonométrie', code: 'Math.sin' },
			cos: { name: 'cos', desc: 'Cosinus (x)', args: 'x', cat: 'Trigonométrie', code: 'Math.cos' },
			tan: { name: 'tan', desc: 'Tangente (x)', args: 'x', cat: 'Trigonométrie', code: 'Math.tan' },
			asin: { name: 'asin', desc: 'Arcsinus (retourne en radians)', args: 'x', cat: 'Trigonométrie', code: 'Math.asin' },
			acos: { name: 'acos', desc: 'Arccosinus (retourne en radians)', args: 'x', cat: 'Trigonométrie', code: 'Math.acos' },
			atan: { name: 'atan', desc: 'Arctangente (retourne en radians)', args: 'x', cat: 'Trigonométrie', code: 'Math.atan' },
			// Logarithmes / exponentielles
			ln: { name: 'ln', desc: 'Logarithme népérien (base e)', args: 'x', cat: 'Logarithmique', code: 'Math.log' },
			log10: { name: 'log10', desc: 'Logarithme base 10', args: 'x', cat: 'Logarithmique', code: 'Math.log10' },
			exp: { name: 'exp', desc: 'Exponentielle e^x', args: 'x', cat: 'Logarithmique', code: 'Math.exp' },
			pow10: { name: 'pow10', desc: '10^x', args: 'x', cat: 'Logarithmique', code: 'pow10' },
			// Racines / autres
			round: { name: 'round', desc: 'Arrondir', args: 'x', cat: 'Général', code: 'Math.round' },
			sqrt: { name: 'sqrt', desc: 'Racine carrée', args: 'x', cat: 'Général', code: 'Math.sqrt' },
			cbrt: { name: 'cbrt', desc: 'Racine cubique', args: 'x', cat: 'Général', code: 'Math.cbrt' },
			abs: { name: 'abs', desc: 'Valeur absolue', args: 'x', cat: 'Général', code: 'Math.abs' },
			rand: { name: 'rand', desc: "Nombre aléatoire entre 0 et 1 (pas d'argument)", args: '()', cat: 'Général', code: 'Math.random' },
			// Probabilités / combinatoires
			fact: { name: 'fact', desc: 'Factorielle n! (n entier >=0)', args: 'n', cat: 'Probabilité', code: 'fact' },
			perm: { name: 'perm', desc: 'Permutation P(n,k) = n!/(n-k)!', args: 'n,k', cat: 'Probabilité', code: 'perm' },
			comb: { name: 'comb', desc: 'Combinaison C(n,k)', args: 'n,k', cat: 'Probabilité', code: 'comb' },
			norm: { name: 'norm', desc: 'Loi normale: norm(x, mean=0, std=1)', args: 'x, mean, std', cat: 'Probabilité', code: 'norm' },
			binom: { name: 'binom', desc: 'Loi binomiale: binom(k, n, p)', args: 'k, n, p', cat: 'Probabilité', code: 'binom' },
			poisson: { name: 'poisson', desc: 'Loi de Poisson: poisson(k, λ)', args: 'k, lambda', cat: 'Probabilité', code: 'poisson' },
			// Constantes
			pi: { name: 'pi', desc: 'Constante pi', args: '()', cat: 'Constantes', code: 'Math.PI' },
			e: { name: 'e', desc: 'Constante e', args: '()', cat: 'Constantes', code: 'Math.E' }
		};

		// Variables d'état
		let currentMode = 'normal';
		let currentBase = 10; // 2,8,10,16
		let expression = '';
		let isSciNotation = false;
		let isRadMode = true; // true: radians, false: degrés
		let HISTORY = [];
		let ANS = 0;

		// Références DOM
        /** @type {JQuery<HTMLElement>} */
		const $input = $window.find('#expression-input');
        /** @type {JQuery<HTMLElement>} */
		const $result = $window.find('#result-display');
        /** @type {JQuery<HTMLElement>} */
		const $keypad = $window.find('#keypad');
        /** @type {JQuery<HTMLElement>} */
		const $auto = $window.find('#autocomplete-suggestions');
        /** @type {JQuery<HTMLElement>} */
		const $docModal = $window.find('#documentation-modal');
        /** @type {JQuery<HTMLElement>} */
		const $docContent = $window.find('#doc-content');
        /** @type {JQuery<HTMLElement>} */
		const $docSearch = $window.find('#doc-search-input');
        /** @type {JQuery<HTMLElement>} */
		const $baseDisplay = $window.find('#base-display');
        /** @type {JQuery<HTMLElement>} */
		const $progBases = $window.find('#programmer-bases');

		// Helpers: factorial, perm, comb
		function fact(n) {
			n = Number(n);
			if (!Number.isInteger(n) || n < 0) throw new Error('Factorielle: entier naturel attendu');
			let r = 1;
			for (let i = 2; i <= n; i++) r *= i;
			return r;
		}
		function perm(n, k) { n = Number(n); k = Number(k); if (!Number.isInteger(n) || !Number.isInteger(k) || n < k) throw new Error('perm: n et k entiers, n>=k'); return fact(n) / fact(n - k); }
		function comb(n, k) { n = Number(n); k = Number(k); if (!Number.isInteger(n) || !Number.isInteger(k) || n < k) throw new Error('comb: n et k entiers, n>=k'); return fact(n) / (fact(k) * fact(n - k)); }
		function norm(x, mean = 0, std = 1) {
			const z = (x - mean) / std;
			return Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI));
		}
		function binom(k, n, p) {
			return comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
		}
		function poisson(k, lambda) {
			return Math.pow(lambda, k) * Math.exp(-lambda) / fact(k);
		}

		function handleTrig(fn, value) {
			const v = isRadMode ? value : value * (Math.PI / 180);
			return fn(v);
		}

		// Mapping pour remplacer par du JS safe
		const CODE_MAPPINGS = Object.assign({}, ...Object.keys(FUNCTIONS).map(k => ({ [k]: FUNCTIONS[k].code })));
		CODE_MAPPINGS['pi'] = 'Math.PI';
		CODE_MAPPINGS['e'] = 'Math.E';

		function sanitizeAndPrepare(expr) {
			let safe = String(expr).replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');

			// Remplacer les noms de fonctions/constantes par les références JS enregistrées
			for (const key of Object.keys(CODE_MAPPINGS)) {
				// Remplacement seulement si mot entier (ne casse pas des identifiants plus longs)
				safe = safe.replace(new RegExp('\\b' + key + '\\b', 'g'), CODE_MAPPINGS[key]);
			}

			// Gérer trig: remplacer Math.sin(...) par handleTrig(Math.sin, ...)
			['sin', 'cos', 'tan'].forEach(fn => {
				safe = safe.replace(new RegExp('Math\\.' + fn + '\\(([^)]*)\\)', 'g'), 'handleTrig(Math.' + fn + ', $1)');
			});

			// Empêcher des accès non autorisés: n'autoriser que chiffres, opérateurs, Math, fact, comb, perm, handleTrig, parenthèses, e et pi remplacés
			if (/[^0-9+\-*/().,\sA-Za-z_*<>^%]/.test(safe)) {
				// autoriser peu mais garder simple: on laissera eval sur string préparée
			}

			return safe;
		}

		function evalExpression() {
			if (!expression) return '';
			try {
				if (currentMode === 'programmer') {
					const v = parseInt(expression, currentBase);
					if (isNaN(v)) throw new Error('Entrée invalide pour la base ' + currentBase);
					updateProgrammerBases(v);
					ANS = v;
					HISTORY.push(expression + ' = ' + v);
					return formatResult(v);
				}

				let prepared = sanitizeAndPrepare(expression);
				// remplacer ANS par la dernière valeur
				prepared = prepared.replace(/\bans\b/g, String(ANS));

				// eslint-disable-next-line no-eval
				let res = eval(prepared);

				if (typeof res === 'function') res = res();

				if (!isFinite(res) || isNaN(res)) throw new Error('Erreur calcul');

				ANS = Number(res);
				HISTORY.push(expression + ' = ' + ANS);
				return formatResult(ANS);
			} catch (err) {
				return 'Erreur';
			}
		}

		function formatResult(val) {
			if (typeof val !== 'number') return String(val);
			if (isSciNotation) return val.toExponential(10);
			// éliminer erreurs d'arrondi
			const fixed = parseFloat(val.toFixed(10));
			return String(fixed);
		}

		// Autocomplétion intelligente
		function checkAutocomplete(currentExpr) {
			// Cherche le dernier token alphnum en fin d'expression
			const match = currentExpr.match(/([a-zA-Z][a-zA-Z0-9_]*)$|([a-zA-Z][a-zA-Z0-9_]*?)\($/);
			$auto.empty();
			if (!match) { $auto.hide(); $input.removeClass('invalid-function'); return; }

			const typed = (match[1] || match[2] || '').toLowerCase();
			if (!typed) { $auto.hide(); $input.removeClass('invalid-function'); return; }

			const candidates = Object.keys(FUNCTIONS).filter(k => k.startsWith(typed));

			if (candidates.length === 0) {
				// afficher le token en rouge si ce n'est pas une constante
				if (!['pi', 'e'].includes(typed) && !/^[0-9]+$/.test(typed)) $input.addClass('invalid-function');
				$auto.hide();
				return;
			}

			$input.removeClass('invalid-function');
			// build suggestions
			candidates.forEach(name => {
				const fn = FUNCTIONS[name];
				const $it = $(`<div class='suggestion-item' data-fn='${name}'>${name}(${fn.args}) — <span style='color:#9CA3AF'>${fn.cat}</span></div>`);
				$it.on('click', () => {
					// --- historique et "ANS" ---
					// Remplace le token courant par name()
					const before = expression.replace(/([a-zA-Z][a-zA-Z0-9_]*)$|([a-zA-Z][a-zA-Z0-9_]*?)\($/, '');
					expression = before + name + '(';
					updateDisplay();
					$input.focus();
					// positionne le curseur
					const el = $input[0]; el.setSelectionRange(expression.length, expression.length);
					$auto.hide();
				});
				$auto.append($it);
			});

			// positionner le menu sous l'input
			const offset = $input.position();
			$auto.css({ top: offset.top + $input.outerHeight() + 6, left: offset.left });
			$auto.show();
		}

		function updateDisplay() {
			$input.val(expression || '');
			const r = evalExpression();
			$result.text(r);
			if (currentMode !== 'programmer') checkAutocomplete(expression);
			else $auto.hide();
		}

		// Keypad definitions (plus complet et cohérent)
		const normalKeys = [
			['DEG', '(', ')', '^', '÷', 'ANS'],
			['7', '8', '9', '×', '%', 'sqrt'],
			['4', '5', '6', '-', 'pow10', 'fact'],
			['1', '2', '3', '+', 'ln', 'log10'],
			['0', '.', '=', 'pi', 'e', 'rand']
		];

		const scientificKeys = [
			['DEG', '(', ')', '^', '÷', 'ANS'],
			['7', '8', '9', '×', '%', 'sqrt'],
			['4', '5', '6', '-', 'pow10', 'fact'],
			['1', '2', '3', '+', 'ln', 'log10'],
			['0', '.', '=', 'pi', 'e', 'rand'],
			['x^2', 'x^3', 'exp', '', '', ''],
			['sin', 'cos', 'tan', 'asin', 'acos', 'atan'],
			['perm', 'comb', 'cbrt', 'norm', 'biom', ''],
		];

		const programmerKeys = [
			['LSH', 'RSH', 'AND', 'OR', 'XOR', 'NOT'],
			['7', '8', '9', 'A', 'B', 'C'],
			['4', '5', '6', 'D', 'E', 'F'],
			['1', '2', '3', '0', '=', '']
		];

		// rend une touche
		function createKey(content) {
			const $btn = $(`<div class='calc-key' data-value='${content}'>${content}</div>`);
			// règles disable pour programmeur
			if (currentMode === 'programmer') {
				if (/^[0-9]$/.test(content)) {
					const digit = parseInt(content, 10);
					if (digit >= currentBase) $btn.addClass('disabled').prop('disabled', true);
				}
				if (/^[A-F]$/.test(content) && currentBase < 16) $btn.addClass('disabled').prop('disabled', true);
				if (content === '.') $btn.addClass('disabled').prop('disabled', true);
			}
			if (/^[0-9]$/.test(content)) {
				$btn.addClass('key-num');
			}
			if (/^[A-F]$/.test(content)) {
				$btn.addClass('key-num');
			}
			if (content === '=') {
				$btn.addClass('key-accent');
			}
			if (content === 'ANS') {
				$btn.addClass('key-orange');
			}
			if (content === 'DEG' || content === 'RAD') {
				$btn.addClass('key-red');
			}
			if (content === '') {
				$btn.addClass('disabled');
			}

			$btn.on('click', () => handleKeyPress(content));
			return $btn;
		}

		function renderKeypadFor(mode) {
			$keypad.empty();
			let layout;
			if (mode === 'normal') layout = normalKeys;
			else if (mode === 'scientific') layout = scientificKeys;
			else layout = programmerKeys;

			layout.forEach(row => row.forEach(k => $keypad.append(createKey(k))));

			// afficher boutons base
			if (mode === 'programmer') { $baseDisplay.removeClass('hidden'); $progBases.removeClass('hidden'); updateProgrammerBases(0); }
			else { $baseDisplay.addClass('hidden'); $progBases.addClass('hidden'); }
		}

		function switchMode(mode) {
			currentMode = mode;
			expression = '';
			isSciNotation = false;
			isRadMode = true;
			$window.find('.mode-button').removeClass('active');
			$window.find(`#mode-${mode}`).addClass('active');
			renderKeypadFor(mode);
			updateDisplay();
		}

		function updateProgrammerBases(decValue) {
			const v = Number.isFinite(decValue) ? Math.floor(Math.max(0, decValue)) : 0;
			$window.find('#base-dec').text('DEC: ' + v);
			$window.find('#base-hex').text('HEX: ' + v.toString(16).toUpperCase());
			$window.find('#base-oct').text('OCT: ' + v.toString(8));
			$window.find('#base-bin').text('BIN: ' + v.toString(2));
		}

		function setBase(b) {
			currentBase = b; renderKeypadFor('programmer');
			$baseDisplay.find('.base-btn').removeClass('active');
			$baseDisplay.find(`.base-btn[data-base='${b}']`).addClass('active');
			// adapter expression pour nouvelle base
			if (expression) {
				const dec = parseInt(expression, currentBase);
				if (!isNaN(dec)) expression = dec.toString(currentBase).toUpperCase();
			}
			updateDisplay();
		}

		// Gestion des touches programmeur
		function handleProgrammerOperation(op) {
			let dec = expression ? parseInt(expression, currentBase) : 0;
			if (isNaN(dec)) dec = 0;
			switch (op) {
				case 'BIN': setBase(2); break;
				case 'OCT': setBase(8); break;
				case 'DEC': setBase(10); break;
				case 'HEX': setBase(16); break;
				case 'AC': expression = ''; break;
				case 'C': expression = ''; break;
				case 'NOT': dec = (~dec) >>> 0; expression = dec.toString(currentBase).toUpperCase(); break;
				case 'LSH': {
					const s = prompt('Décalage gauche: nombre de bits (entier)'); if (s === null) return; const n = parseInt(s, 10); if (isNaN(n)) { alert('Valeur invalide'); return; } dec = dec << n; expression = dec.toString(currentBase).toUpperCase(); break;
				}
				case 'RSH': {
					const s = prompt('Décalage droit: nombre de bits (entier)'); if (s === null) return; const n = parseInt(s, 10); if (isNaN(n)) { alert('Valeur invalide'); return; } dec = dec >> n; expression = dec.toString(currentBase).toUpperCase(); break;
				}
				case 'AND': case 'OR': case 'XOR': {
					const s = prompt('Second opérande (dans la base courante)'); if (s === null) return; const v = parseInt(s, currentBase); if (isNaN(v)) { alert('Opérande invalide'); return; }
					if (op === 'AND') dec = dec & v; if (op === 'OR') dec = dec | v; if (op === 'XOR') dec = dec ^ v;
					expression = dec.toString(currentBase).toUpperCase();
					break;
				}
				default: // chiffres/hex
					// géré ailleurs
					break;
			}
			updateProgrammerBases(dec);
		}

		function toggleDegRad() {
			if (isRadMode) {
				const $degKey = $('.calc-key[data-value="DEG"]');
				$degKey.text('RAD');
				$degKey.attr('data-value', 'RAD');
			} else {
				const $radKey = $('.calc-key[data-value="RAD"]');
				$radKey.text('DEG');
				$radKey.attr('data-value', 'DEG');
			}
			isRadMode = !isRadMode;
		}

		function handleKeyPress(value) {
			if (currentMode === 'programmer') {
				// si c'est une opération spéciale
				if (/^(BIN|OCT|DEC|HEX|LSH|RSH|AND|OR|XOR|NOT|AC|C)$/.test(value)) { handleProgrammerOperation(value); return; }
				if (value === '=') return; // pas de calcul dans ce mode

				// ajouter chiffre/lettre
				if (expression === '0') expression = '';
				expression += value;
				updateDisplay();
				return;
			}

			// Normal/Scientifique
			switch (value) {
				case 'ANS': expression += ANS; updateDisplay(); break;
				case 'HIST': showHistory(); break;
				case 'AC': expression = ''; $result.text(''); break;
				case 'C': expression = expression.slice(0, -1); break;
				case '=': {
					const out = evalExpression();
					if (out !== 'Erreur') { expression = out; $result.text(''); }
					break;
				}
				case 'x^2': expression += '**2'; break;
				case 'x^3': expression += '**3'; break;
				case '^': expression += '^'; break; // ^ sera converti en ** par sanitize
				case 'DEG': case 'RAD': toggleDegRad(); break;
				case 'sqrt': case 'cbrt': case 'abs': case 'rand': case 'fact': case 'perm': case 'comb': case 'sin': case 'cos': case 'tan': case 'asin': case 'acos': case 'atan': case 'ln': case 'log10': case 'exp': case 'pow10':
					// fonctions: ajout du nom et ouverture de parenthèse
					if (value === 'pow10') expression += 'pow10(';
					else expression += value + '(';
					break;
				case 'pi': case 'e': expression += value; break;
				case '÷': case '×': case '-': case '+': case '(': case ')': case '%':
					expression += value; break;
				case '.': expression += '.'; break;
				default:
					// chiffres et autres
					if (expression === '0' || expression === '') expression = value; else expression += value;
					break;
			}
			updateDisplay();
		}

		// Documentation
		function renderDocumentation(filter) {
			filter = (filter || '').toLowerCase();
			$docContent.empty();
			const grouped = {};
			Object.values(FUNCTIONS).forEach(f => {
				if (!filter || f.name.includes(filter) || f.desc.toLowerCase().includes(filter) || f.cat.toLowerCase().includes(filter)) {
					if (!grouped[f.cat]) grouped[f.cat] = [];
					grouped[f.cat].push(f);
				}
			});
			if (Object.keys(grouped).length === 0) { $docContent.append('<div class="doc-entry">Aucune fonction trouvée.</div>'); return; }
			Object.keys(grouped).forEach(cat => {
				$docContent.append(`<h3 style='color:#7dd3fc'>${cat}</h3>`);
				grouped[cat].forEach(f => {
					const $entry = $(`<div class='doc-entry'><b>${f.name}(${f.args})</b><div style='color:#9CA3AF'>${f.desc}</div></div>`);
					$docContent.append($entry);
				});
			});
		}

		function toggleDocModal(show) {
			if (show) {
				renderDocumentation('');
				$docModal.removeClass('hidden');
				setTimeout(() => {
					$docModal.removeClass('opacity-0');
					$docModal.find('.max-w-lg').removeClass('scale-95');
					$docSearch.focus();
				}, 10);
			} else {
				$docModal.addClass('opacity-0');
				$docModal.find('.max-w-lg').addClass('scale-95');
				setTimeout(() => {
					$docModal.addClass('hidden');
				}, 300);
			}
		}

		function showHistory() {
			const h = HISTORY.slice(-10).map(e => `<div>${e}</div>`).join('');
		}

		// Événements globaux
		$window.on('click', '.mode-button', function () { const m = $(this).data('mode'); if (m) switchMode(m); });
		$window.on('click', '#doc-btn', () => toggleDocModal(true));
		$window.on('click', '#doc-close-btn', () => toggleDocModal(false));
		$docSearch.on('input', () => renderDocumentation($docSearch.val()));
		$window.on('click', '.base-btn', function () { setBase(parseInt($(this).data('base'))); });

		// Input handling
		$input.on('input', function () { expression = $(this).val(); updateDisplay(); });
		
		// cacher autocomplétion si click ailleurs
		$(document).on('click', function (e) { if (!$(e.target).closest('#autocomplete-suggestions').length && e.target !== $input[0]) $auto.hide(); });

		// init
		switchMode('normal');

		// expose API
		return { pause: () => { }, resume: () => { }, restart: () => { expression = ''; updateDisplay(); } };
	}
};
