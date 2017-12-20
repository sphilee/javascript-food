import foodBoxTemplate from '../template/foodBox-tpl.html';
import foodTabTemplate from '../template/foodTab-tpl.html';
import containerTemplate from '../template/container-tpl.html';
import badgeTemplate from '../template/badge-tpl.html';
import deliveryTypeTemplate from '../template/deliveryType-tpl.html';
import {qs,qsa,$on,$delegate} from './helpers';

export default class View {
    constructor() {
        this.foodListEl;
        this.foodTabEl = qs('.best_food_tabs');
        this.slidesPrevEl = qs('.slides_prev');
        this.slidesNextEl = qs('.slides_next');
        this.slidesEl = qsa('.main_slides_list > li');
        this.dotsEl = qsa('.slides_dots > li > a');
    }


    bindSlidesPrev(handler) {
        $on(this.slidesPrevEl, 'click', () => handler(-1));
    }

    bindSlidesNext(handler) {
        $on(this.slidesNextEl, 'click', () => handler(1));
    }

    bindSlidesDots(handler) {
        $delegate('.slides_dots', '.slides_dots > li > a', 'click', (e) => handler(+e.delegateTarget.textContent));
    }

    bindPreventDefault() {
        $delegate('body', 'a', 'click', e => e.preventDefault());
    }

    renderFoodTab(food) {
        const foodTabString = food.map(value => foodTabTemplate({
            category_id: value.category_id,
            name: value.name
        })).join('');
        this.foodTabEl.insertAdjacentHTML('afterbegin', foodTabString);
    }

    renderFoodContainer(food) {
        const foodContainer = qs('.best_food_container');
        const containerString = food.map(value => containerTemplate({
            category_id: value.category_id
        })).join('');
        foodContainer.insertAdjacentHTML('afterbegin', containerString);
    }

    renderFoodList(food) {
        this.foodListEl = qsa('.best_food_box_list');
        food.forEach((value, i) => {
            const foodBoxStrs = value.items.map(item =>
                foodBoxTemplate({
                    image: item.image,
                    alt: item.alt,
                    title: item.title,
                    description: item.description,
                    old_price: item.n_price ? item.n_price : '',
                    new_price: item.s_price.slice(0, -1),
                    won: item.s_price.slice(-1)
                })).join('');
            this.foodListEl[i].insertAdjacentHTML('afterbegin', foodBoxStrs);
        });
    }

    renderFoodBox(food) {
        const foodBox = qsa('.best_food_box');
        food.forEach((value, i) => {
            value.items.forEach((item, j) => {
                const badges = badgeTemplate({
                    badge: item.badge
                });
                foodBox[i * 3 + j].insertAdjacentHTML('beforeend', badges);
                const deliveryType = deliveryTypeTemplate({
                    delivery_type: item.delivery_type
                });
                foodBox[i * 3 + j].firstElementChild.insertAdjacentHTML('beforeend', deliveryType);
            });
        });
    }

    renderFoodTabList(food, initNum) {
        const foodTabList = qsa('.best_food_tabs > li > a');
        this.foodListEl[initNum].style.display = 'block';
        foodTabList[initNum].className = 'now';
        this.bindFoodTab(foodTabList);
        this.bindPreventDefault();
    }

    bindFoodTab(foodTabList) {
        $delegate(this.foodTabEl, 'li > a', 'click', e => {
            Array.from(foodTabList).forEach(tab => tab.className =
                tab === e.delegateTarget ? 'now' : '');
            Array.from(this.foodListEl).forEach(food => food.style.display =
                e.delegateTarget.dataset.category_id === food.dataset.category_id ? 'block' : 'none');
        });
    }

    removeCurrentDisplay(currentIndex) {
        this.slidesEl[currentIndex].className = 'fadeout';
        setTimeout(() => {
            this.slidesEl[currentIndex].style.display = 'none';
        }, 1000);
        this.dotsEl[currentIndex].classList.remove('now');
    }

    showSlides(slideIndex, slideImg) {
        this.slidesEl[slideIndex].style.display = 'block';
        this.slidesEl[slideIndex].className = 'fadein';
        this.slidesEl[slideIndex].style.backgroundImage = `url("${slideImg}")`;
        this.dotsEl[slideIndex].className = 'now';
    }


}