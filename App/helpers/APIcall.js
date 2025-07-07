import axios from 'axios'

export default (context, path, withLoader = true) => {
    if(withLoader) context.commit('ADD_LOADING'); 

    return axios.get(path)
        .then(res => {
            return res.data;
        })
        .catch(err => {
          console.error(err.response);
          if(context.state.data_error == null)  context.commit('SET_MESSAGE_ERROR', err.response);

          //TEST
          /* console.error(err);
          if(context.state.data_error == null)  context.commit('SET_MESSAGE_ERROR', String(err)); */
        })
        .finally(() => { 
            if(withLoader) context.commit('REMOVE_LOADING');
        });
}