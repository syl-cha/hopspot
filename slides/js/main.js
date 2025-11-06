import Reveal from '../reveal/dist/reveal.esm.js';
import RevealHighlight from '../reveal/plugin/highlight/highlight.esm.js';
import RevealMarkdown from '../reveal/plugin/markdown/markdown.esm.js';

$(document).ready(function () {
  const $presentation = $('#presentation');

  // Charger le fichier presentation.md
  $.ajax({
    url: './presentation.md',
    dataType: 'text',
    cache: false,
    beforeSend: function (xhr) {
      xhr.overrideMimeType('text/plain; charset=utf-8');
    },
    success: function (data) {
      // Injecter le contenu dans l'élément
      $presentation.text(data);

      // Initialiser Reveal.js APRÈS le chargement du contenu
      Reveal.initialize({
        hash: true,
        plugins: [RevealMarkdown, RevealHighlight],
      });
    },
    error: function (xhr, status, error) {
      console.error('Erreur lors du chargement du fichier:', error);
      $presentation.text('Erreur lors du chargement de la présentation.');
    },
  });
});
