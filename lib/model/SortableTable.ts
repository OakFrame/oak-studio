import {ejs as _ejs} from "../external/ejs";

export const ejs = _ejs;

export interface SortableTableOptions {
    page: number;
    data: any;
    items_per_page:number;
}

export interface SortableFilter {
    options: string[],
    selected: string[],
    fn: any;
}


export class SortableTable {

    private source_fn: any;
    private template_row;
    private element: HTMLElement;
    private rows_element: HTMLElement;
    private filter_element: HTMLElement;
    private current_rows: HTMLElement[];
    private options: SortableTableOptions;
    private rendered: SortableTableOptions;
    private filters;


    constructor() {
        this.element = document.createElement('div');
        this.filter_element = document.createElement('div');
        this.rows_element = document.createElement('div');
        this.element.appendChild(this.filter_element);
        this.element.appendChild(this.rows_element);
        this.current_rows = [];
        this.filters = [];
        this.options = {
            page: 0,
            data: 0,
            items_per_page:10
        }
        this.rendered = {
            page: -1,
            data: -1,
            items_per_page:10
        }
    }

    addFilter(options: SortableFilter) {
        this.filters.push(options);
    }

    setRowTemplate(template) {
        this.template_row = template;
    }

    source(fn) {
        this.source_fn = fn;
    }

    render() {
        if (!this.source_fn) {
            return
        }
        this.current_rows = [];
        this.rows_element.innerHTML = "";
        this.filter_element.innerHTML = "";
        let data = this.getData();

        let start = (this.options.page*this.options.items_per_page);
        let end = ((this.options.page+1)*this.options.items_per_page);

        console.log('a', start, end, data[start])

        for (let i = 0; i < this.options.items_per_page; i++) {

            let d = data[i+start];

            let el = document.createElement('div')
            if (d) {
                el.innerHTML = ejs.render(this.template_row, d);
            }
            this.rows_element.appendChild(el)
          //  console.log('rendering row', data[i]);
            this.current_rows.push(el);
        }

        this.filters.forEach((filter: SortableFilter) => {
            let controls = document.createElement("div");

            filter.options.forEach((option)=>{
                let el = document.createElement('div');
                el.className="button";
                function getHTML(){
                   return `${option} <i class="fas fa-fw fa-${filter.selected.indexOf(option)!==-1?'check':'times'}"></i>`
                }
                el.innerHTML = getHTML();
                controls.appendChild(el);

                el.onclick = ()=>{
                    console.log('CLICKED ON A FILTER');
                    let d = filter.selected.indexOf(option);

                    if (d === -1){
                        filter.selected.push(option);
                    }else{
                       filter.selected =  filter.selected.filter((s)=>{
                           return s !== option;
                       });
                    }

                    this.render();

                   // el.innerHTML = getHTML();

                    //console.log(filter.selected);
                };

            });


            this.filter_element.appendChild(controls);

        });


    }

    getData(){
        let data = this.source_fn();
        //console.log('data len,a',data.length);

        this.filters.forEach((filter: SortableFilter) => {

            data = data.filter((item) => {
                return filter.fn(item, filter.selected);
            });

        });

        //console.log('data len,b',data.length);
        return data;
    }

    update() {


        let data = this.getData();

        this.options.data = data;
       // console.log('after filter', data);

        if (JSON.stringify(this.rendered.data) !== JSON.stringify(this.options.data)) {
            this.render();
        }

       // console.log('UPDATE FIELDS FILTERED DATA');

        let start = (this.options.page*this.options.items_per_page);
        let end = ((this.options.page+1)*this.options.items_per_page);


        for (let i = 0; i < this.options.items_per_page; i++) {

            let el = data[i+start];
            if (!el){
                this.current_rows[i].innerHTML = "";
                continue;
            }
            let row_u = ejs.render(this.template_row, data[i+start]);

            if (row_u !== this.current_rows[i].innerHTML) {
                this.current_rows[i].innerHTML = row_u;
            }
            //this.rows_element.appendChild(el)
        }

        this.rendered = Object.assign(this.rendered,this.options);

    }

    getElement() {
        return this.element;
    }

}
