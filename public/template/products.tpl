{{#if productosJson}}
  <table class="table">
    <thead>
      <tr>
        <th class="col">#</th>
        <th class="col">Título</th>
        <th class="col">Precio</th>
        <th class="col">Imagen</th>
      </tr>
    </thead>

    <tbody>
      {{#each productosJson}}
        <tr>
          <th scope="row">{{this.id}}</th>
          <td>{{this.title}}</td>
          <td>{{this.price}}</td>
          <td>

            <img
              style="width: 10rem"
              src="{{this.imageURL}}"
              alt="{{this.title}}"
            />
          </td>
        </tr>
      {{/each}}
    </tbody>
  </table>
{{else}}
  <h1>No hay productosJson</h1>
{{/if}}