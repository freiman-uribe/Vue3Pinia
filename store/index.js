import { defineStore } from 'pinia';

export const userStore = defineStore('store', {
  state: () => {
    return {
      list: [],
      listFilter: [],
      totalPage: 0,
      perPage: 0
    }
  },

  actions: {
    async listUsers({ actualPage }) {
      const exist = await this.list.some(element => actualPage === element.page)
      try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users?page=${actualPage}`)
          if (response.ok) {
              const {data, page, total_pages, per_page} = await response.json()
              this.totalPage = total_pages
              this.perPage = per_page
              await this.list.push({page, dataPage: data})
          } else {
              console.error('Error al obtener los datos:', response.statusText)
          }
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    },

  },

  getters: {

    getList(state) {
      return async (pageActual) => {
        try {
          const existPage = await state.list.findIndex(element => pageActual === element.page)
          
          if(existPage >= 0){ 
            return state.list[existPage]
          }
          
          await this.listUsers({ actualPage: pageActual })
          const list = state.list 
          return list[list.length - 1]

        } catch (error) {
          console.error('Error al obtener los datos:', error)
        }
      }
    },

    getTotalPage: (state) => state.totalPage,
    getPerPage: (state) => state.perPage,

    getFilterDetailUSer: (state) => (search) => {
      try {
        for (let page = 1; page <= state.totalPage; ++page) {
          state.getList(page)
        }

        const newList = state.list.flatMap(({ dataPage }) => {
          return dataPage.filter(({ email, first_name }) =>email.toLowerCase().includes(search.toLowerCase()) || first_name.toLowerCase().includes(search.toLowerCase()));
        });

        return newList

      } catch (error) {
        console.log(error);
      }
      
    },
  },
  
})