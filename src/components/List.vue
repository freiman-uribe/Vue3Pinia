<script setup>
  import { ref, watch, onMounted, computed } from 'vue';
  import { userStore } from '../../store'
  import Loading from './Loading.vue';

  const store = userStore()
  const loading = ref(true)
  const listUser = ref([])
  const totalPage = ref(0)
  const actualPage = ref(1)
  const search = ref('')
  const listFilter = ([])

  const fetchList = () => {
    new Promise((resolve, reject) => {
      resolve(store.getList(actualPage.value))
    }).then(({dataPage}) => {
      listUser.value = dataPage
      totalPage.value = store.getTotalPage
      loading.value = false
    }).catch(error => console.error('Error>> ', error))
  }

  const list = computed(() => {
    try {
      if (search.value.length > 0) {
        listFilter.value = store.getFilterDetailUSer(search.value)

        const paginas = Math.floor(listFilter.value.length / store.perPage);
        const hayResiduo = listFilter.value.length % store.perPage !== 0;
        
        if (hayResiduo) {
          totalPage.value = paginas + 1;
        } else {
          totalPage.value = paginas;
        }

        loading.value = false
        return listFilter.value;
      } else {
        fetchList()
        return listUser.value;
      }
    } catch (error) {
      console.error('error', error);
    }
  });

  onMounted(() => {
    fetchList()
  });

  const clickPage = (page) => {
    loading.value = true
    actualPage.value = page
    fetchList()
  }

  watch(search, () => {
    list
  });

</script>

<template>
  <Loading v-if="loading" />
  <div v-else class="container">
    <div class="header">
      <h2>Lista de clientes</h2>
      <div class="search">
        <input class="search-input" type="search" v-model="search" placeholder="Buscar por nombre o email">
      </div>
    </div>
    <div class="body" v-if="list.length">
      <div class="group-card">
        <div class="card" v-for="person in list">
          <div class="card-header">
            <img class="card-image" :src="person.avatar" :alt="person.first_name">
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ `${person.first_name} ${person.last_name} `}}</h3>
            <span>{{ person.email }}</span>
          </div>
          <div class="card-footer">
            <router-link :to="`/detail/${person.id}`" class="card-btn-details">Ver mas...</router-link>
          </div>
        </div> 
      </div>
      <div class="pagination">
        <div class="pagination-page" v-for="numberPage in totalPage">
          <button @click="clickPage(numberPage)" :class="{ 'page-active': actualPage === numberPage}" :disabled="actualPage === numberPage">{{numberPage}}</button>
        </div>
      </div>
    </div>
    <div class="error" v-else>
      <span class="text-error">No se ncontraron los datos!</span>
    </div>
  </div>
</template>

<style scoped>

.container {
  width: 80%;
  margin: auto;
}

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.search-input {
  margin: auto;
  width: 250px;
  height: 35px;
  padding: 5px;
  border: 1px solid #fff;
  border-radius: 5px;
}

.group-card {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}

.card-header {
  width: 80%;
  height: 150px;
  margin: auto;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  top: 0;
  left: 0;
}

.card-title {
  text-align: center;
}


.card-footer {
  text-align: end;
  margin-top: 10px;
}

.card-btn-details {
  color: rgb(43, 129, 129);
}

.card-btn-details:hover {
  color: rgb(59, 175, 175);
}

.pagination {
  display: flex;
  gap: 5px;
  justify-content: end;
}

.page-active {
  background-color: rgb(59, 175, 175);
}

.error {
  text-align: center;
  margin: 50px 0px;
}

.text-error {
  padding: 10px;
  border: 2px solid rgb(43, 129, 129);;
  border-radius: 5px;
  background-color: rgba(59, 175, 175, 0.199);
}

</style>
