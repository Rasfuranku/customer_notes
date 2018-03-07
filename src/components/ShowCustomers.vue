<template>
<div id="app">
    <v-data-table
      :headers="headers"
      :items="items"
      hide-actions
      class="elevation-1"
      item-key="name"
    >
      <template slot="items" slot-scope="props">
        <tr @click="getCustomerDetail(props.item._id, expanded)" class="customers">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.status }}</td>
          <td class="text-xs-right">{{ props.item.createdAt }}</td>
        </tr>
        <tr class="expand customer-info" v-show="props.item._id == customer._id">
          <td colspan="100%">
            <v-container grid-list-md text-xs-center>
              <v-layout row wrap>
                <v-flex xs4>
                  <v-card dark color="primary">
                    <v-card-text class="px-0">
                      <h5>Website</h5>
                      <p>{{customer.website}}</p>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs4>
                  <v-card dark color="primary">
                    <v-card-text class="px-0">
                      <h5>Address</h5>
                      <p>{{customer.address}}</p>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs4>
                  <v-card dark color="primary">
                    <v-card-text class="px-0">
                      <h5>Phone</h5>
                      <p>{{customer.phone}}</p>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2 class="status-customer">
                  <template>
                  <div class="text-xs-center">
                    <v-menu offset-y close-on-content-click>
                      <v-btn color="blue-grey lighten-4" dark slot="activator">Status</v-btn>
                      <v-list>
                        <v-list-tile v-for="s in status" :key="s" @click.stop="changeStatus(customer._id, s)">
                          <v-list-tile-title>{{ s }}</v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                  </template>
                </v-flex>
                <v-flex xs12>
                  <v-card dark color="primary">
                    <v-card-text class="px-0">
                      <h5>Description</h5>
                      <p>{{customer.descr}}</p>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 class="content-notes">
                  <v-flex tag="h1" class="headline">Notes</v-flex>
                  <v-btn large color="blue-grey lighten-4" @click.stop="openDialog('save')" class="add-button">New</v-btn>
                  <!-- ADD NOTE DIALOG -->
                  <v-dialog
                    v-model="dialog"
                    fullscreen
                    transition="dialog-bottom-transition"
                    :overlay="false"
                    scrollable
                  >
                    <v-card tile>
                      <v-toolbar card dark color="light-blue darken-3">
                        <v-btn icon @click.native="dialog = false" dark>
                          <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Add note</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                          <v-btn dark flat @click="addNote(customer._id, comment)" v-show="action == 'save'">Save</v-btn>
                          <v-btn dark flat @click="editNote(currentNote, comment, customer._id)" v-show="action == 'update'">Update</v-btn>
                        </v-toolbar-items>
                      </v-toolbar>
                      <v-card-text>
                        <template>
                            {{comment.note}}
                          <v-form v-model="valid">
                            <v-text-field
                              label="Content of the note"
                              v-model="comment"
                              :rules="nameRules"
                              required
                              box multi-line
                            >{{comment.note}}</v-text-field>
                          </v-form>
                        </template>
                      </v-card-text>

                      <div style="flex: 1 1 auto;"/>
                    </v-card>
                  </v-dialog>
                  <div v-for="n in notes" class="notes">
                    <span>Created at: {{n.createdAt}}</span>
                    <v-card dark color="blue accent-2">
                      <v-card-text class="px-0" @click="update(n._id, n.note)">
                        {{n.note}}
                      </v-card-text>
                    </v-card>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>    
          </td>
        </tr>
      </template>
      <template slot="no-data">
        <v-alert :value="true" color="error" icon="warning">
          Sorry, nothing to display here :(
        </v-alert>
      </template>
    </v-data-table>
</div>
</template>

<script>
export default {
    data(){
      return{
        headers:[
          {
            text: 'Name',
            align: 'left',
            sortable: true,
            value: 'name'
          },
          {
            text: 'Status',
            align: 'center',
            sortable: true,
            value: 'status'
          },
          {
            text: 'Date',
            align: 'center',
            sortable: true,
            value: 'createdAt'
          }
        ],
        items: [],
        customer: {},
        notes: [],
        expanded: false,
        dialog: false,
        valid: false,
        comment: '',
        nameRules: [
          v => !!v || 'Content is required'
        ],
        action: null,
        currentNote: null,
        status: ['Prospective', 'Current', 'Non-active'],
        "close-on-content-click": true
      }
    },

    created: function()
    {
      this.URI = 'http://localhost:3000';
      this.getCustomers();
    },

    methods: {
        getCustomers(){
          let uri = this.URI + '/customer';
          this.axios.get(uri).then((response) => {
              this.items = response.data;
          });
        },
        /**
         * @function getCustomerDetail
         * @description Get the detail of each customer.
         * @param {String} id Id of the customer.
         * @param {Boolean} expanded If false, the panel is close.
         */
        getCustomerDetail(id, expanded){
          let uri = this.URI + '/customer/?id=' +id;
          var self = this;
          this.axios.get(uri).then((response) => {
            this.customer = response.data;
            this.expanded = !expanded;
            self.getCustomerNotes(id);
          });
        },
        /**
         * @function getCustomerNotes
         * @description Get the notes of each customer and set the date in a legible format.
         * @param {String} id Id of the customer.
         */
        getCustomerNotes(id){
          let uri = this.URI + '/notes/?id=' +id;
          this.axios.get(uri).then((response) => {
            var data = response.data;
            for(let i=0; i<data.length; i++){
              var date = new Date(data[i].createdAt);
              var year = date.getFullYear();
              var month = date.getMonth();
              var day = date.getDate();

              data[i].createdAt = year + '/' + month + '/' + day;
            }
            this.notes = data;
          });
        },
        /**
         * @function addNote
         * @description Create a new note for a specific customer.
         * @param {String} id Id of the customer.
         */
        addNote(id, note){
          var self = this;
          let uri = this.URI + '/notes';
          let theNote = {
            customerId: id,
            note: note
          };

          this.axios.post(uri, theNote).then((response) => {
            this.notes.push(response.data);
            self.getCustomerNotes(id);
            self.dialog = false;
          })
        },
        update(id, note){
          this.comment = note;
          this.currentNote = id;
          this.openDialog('update');
        },
        /**
         * @function editNote
         * @description Edit a note for a specific customer.
         * @param {String} idNote Id of the note.
         * @param {String} note Content of the note.
         * @param {String} idCustomer
         */
        editNote(idNote, note, idCustomer){
          var self = this;
          let uri = this.URI + '/notes';
          let theNote = {
            id: idNote,
            note: note
          };

          this.axios.put(uri, theNote).then((response) => {
            self.getCustomerNotes(idCustomer);
            self.dialog = false;
          })
        },
        openDialog(action){
          if(action == 'save') this.comment = '';
          this.action = action;
          this.dialog = true;
        },
        changeStatus(id, status){
          var self = this;
          let uri = this.URI + '/customer';
          let newStatus = {
            id: id,
            status: status
          }
          this.axios.put(uri, newStatus).then((response) => {
            self.getCustomers();
          }, (err) => {
            console.log(err);
          })
        }
    }
}
</script>
