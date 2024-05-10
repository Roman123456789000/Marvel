import { useState, useEffect } from 'react';

import './comicsList.scss';
import useMarvelService from '../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spiner from '../spinner/Spinner';

const ComicsList = () => {

    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
        .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (NewComicsList) => {
        let ended = false;
        if(newItemLoading.length < 8) {
            ended = true;
        }

        setComics([...comics, ...NewComicsList]);
        setNewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(false);
    }
    

    function renderItems (arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        );
    }

    const items = renderItems(comics);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spiner/> : null;


    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display' : comicsEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;