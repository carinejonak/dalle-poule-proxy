jQuery(document).ready(function($) {
  const $button = $('<button>')
    .text('🎨 Générer une image à la une')
    .css({
      marginTop: '10px',
      padding: '10px 15px',
      backgroundColor: '#6271aa',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    })
    .click(async function() {
      const title = $('#title').val();
      if (!title) {
        alert('Veuillez d’abord ajouter un titre à l’article.');
        return;
      }

      const apiUrl = `https://dalle-poule-proxy-v1.vercel.app/api/immobilier?title=${encodeURIComponent(title)}`;

      $(this).prop('disabled', true).text('Génération en cours...');

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.url) {
          // Met à jour le champ "Image mise en avant"
          $('#set-post-thumbnail').parent().find('img').attr('src', data.url);
          $('input[name="thumbnail_input_field"]').val(data.url);
          $('#remove-post-thumbnail').click(); // supprime l’ancienne
        } else {
          alert("Erreur lors de la génération de l'image.");
        }
      } catch (err) {
        alert("Erreur lors de la requête.");
        console.error(err);
      }

      $(this).prop('disabled', false).text('🎨 Générer une image à la une');
    });

  $('#postimagediv .inside').append($button);
});

