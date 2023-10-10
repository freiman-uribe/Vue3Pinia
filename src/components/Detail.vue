<script setup>
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    import Loading from './Loading.vue';
    
    //obtiene parametro enviado por la ruta
    const route = useRoute();
    const userId = ref(route.params.id);
    const user = ref({})
    const loading = ref(true)
    
    const detailClient = async () => {
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId.value}?delay=1`)
          if (response.ok) {
            const {data} = await response.json()
            user.value = data
            loading.value = false
          } else {
            console.error('Error al obtener los datos:', response.statusText)
          }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }

    detailClient()
</script>
<template>
  <Loading v-if="loading" />
  <div v-else class="container">
    <router-link :to="`/`" class="btn-back"> &#60 Regresar</router-link>
    <div class="card">
      <div class="card-header">
        <img class="card-image" :src="user.avatar"/>
      </div>
      <div class="card-body">
        <h2 class="card-title"> {{`${user.first_name} ${user.first_name}`}} </h2>
        <span class="card-email"> {{ user.email }} </span>
      </div>
    </div>
  </div>
</template>

<style scoped>

.btn-back {
  color: rgb(43, 129, 129);
  font-size: 1.2rem;
}

.btn-back:hover {
  color: rgb(59, 175, 175);
}

.card-header {
  width: 100%;
  height: 200px;
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

.card-body {
  text-align: center;
}

.card-title {
  margin: 10px 0px;
}

</style>