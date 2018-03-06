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
                <v-flex xs12>
                  <v-card dark color="primary">
                    <v-card-text class="px-0">
                      <h5>Description</h5>
                      <p>{{customer.descr}}</p>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs12 class="notes">
                  <div v-for="n in notes">
                    <span>{{n.createdAt}}</span>
                    <v-card dark color="blue accent-2">
                      <v-card-text class="px-0">
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
        expanded: false
      }
    },

    created: function()
    {
      this.URI = 'http://localhost:3000';
      this.fetchItems();
    },

    methods: {
        fetchItems()
        {
          let uri = this.URI + '/customer';
          this.axios.get(uri).then((response) => {
              this.items = response.data;
          });
        },
        getCustomerDetail(id, expanded)
        {
          let uri = this.URI + '/customer/?id=' +id;
          var self = this;
          this.axios.get(uri).then((response) => {
            this.customer = response.data;
            this.expanded = !expanded;
            self.getCustomerNotes(id);
          });
        },
        getCustomerNotes(id){
          console.log('getCustomerNotes')
          let uri = this.URI + '/notes/?id=' +id;
          this.axios.get(uri).then((response) => {
            this.notes = response.data;
          });
        }
    }
}
</script>
