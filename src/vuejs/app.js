const Search=require("../vuejs/searchPresenter.js").default;
const Show=require("../vuejs/show.js").default;

export default
function App(props){
    return (<div class="flexParent">
                <div class="mainContent">
                </div>
                <Show hash="#search"><Search model={props.model} /></Show>
            </div>
           );
}