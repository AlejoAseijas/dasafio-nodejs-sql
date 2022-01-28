          {{#each products}}
            <tr>
                <td class="text-center">{{this.title}}</td>
                <td class="text-center">{{this.price}}</td>
                <td class="text-center"> <img src={{this.thumbnail}} style="width: 70px;" /> </td>
            </tr>
            {{/each}}