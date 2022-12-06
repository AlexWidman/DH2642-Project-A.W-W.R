import promiseNoData from "../views/promiseNoData.js";
import SearchFormView from "../views/searchFormView.js";
import SearchResultsView from "../views/searchResultsView.js";
import { searchSpotify } from "../spotifySource.js"
import resolvePromise from "../resolvePromise.js"

const Search={
    props: ["model"],
    data(){ return { searchQuery: "" ,
                    searchType: "",
                searchResultsPromiseState: {promise: "", data: "", error: ""} } },
    created(){ if (!this.searchResultsPromiseState.promise) {resolvePromise(searchSpotify({}), this.searchResultsPromiseState)}; },
    render(){
        function onValueChangeACB(text){ this.searchQuery = text; }
        function onOptionChoiceACB(choice){ this.searchType = choice; }
        function onSearchACB(){ resolvePromise(searchSpotify({query: this.searchQuery, type: this.searchType}), this.searchResultsPromiseState) }
        function onSearchResultACB(result){ this.model.setFirstSong(result.id); }
        function onSearchResultACB(result){ this.model.setSecondSong(result.id); }
        return (
            <div>
                <SearchFormView spotifyTypeOptions={["artists", "tracks"]}
                                onValueChange={onValueChangeACB.bind(this)}
                                onOptionChoice={onOptionChoiceACB.bind(this)}
                                onButtonPress={onSearchACB.bind(this)}/>
                {promiseNoData(this.searchResultsPromiseState)||
                <SearchResultsView searchResults={this.searchResultsPromiseState.data}
                                    onSearchResult={onSearchResultACB.bind(this)}/>}
                
            </div>
        )
    }
};
export default Search;