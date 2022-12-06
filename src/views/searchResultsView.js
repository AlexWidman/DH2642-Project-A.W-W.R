function SearchResultsView(props){
    function showSearchResultsCB(result){
        function onSearchResultACB(){ 
            props.onSearchResult(result);
            /* TODO window.location.hash = "#details"; */
        }
        function returnCoverCB(){
            if (result.data.name){
                return result.data.albumOfTrack.coverArt.sources[0].url
            }
            return result.data.visuals.avatarImage.sources[0].url
        }
        function returnNameCB(){
            if (result.data.name){
                return result.data.name
            }
            return result.data.profile.name
        }
        return (
            <span class="searchResult"
            onClick={onSearchResultACB}>
                <img src={returnCoverCB}height="100">
                </img>
                <div>
                    {returnNameCB}
                </div>
            </span>
        );
    }
    return (
    <div>
        {
            props.searchResults.map(showSearchResultsCB)
        }
    </div>
    );
}

export default SearchResultsView;