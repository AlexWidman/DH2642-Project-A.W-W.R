const Show = {
    props:["hash"],
    data(){ return {hashState: window.location.hash}; }, 
    methods:{
        hashListenerACB(e){ this.hashState = window.location.hash; }
    },
    created(){ 
        window.addEventListener("hashchange", this.hashListenerACB);
    },
    unmounted(){
        window.removeEventListener("hashchange", this.hashListenerACB);
    },
    render(){
        console.log(this.hashState);
        console.log(this.hash);
        return <span 
        class={this.hashState === this.hash? "mainContent": "hidden"}>
            {this.$slots.default()}</span>;
    },
}

export default Show;