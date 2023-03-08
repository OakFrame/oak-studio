export class WindowManager {

    tabs: any[] = [];

    constructor() {
        this.tabs = [];
    }

    containsTabID(id){
        let r = false;
        this.tabs.forEach((t)=>{
            if (t.id === id){
                r= true;
            }
        });
        return r;
    }

    openTab(id): HTMLElement {

        const element = document.createElement('div');

        const tab = {
            id: id,
            element: element
        };

        let tabs = document.getElementById('window-workspace-tabs');
        if (!tabs) {
            tabs = document.createElement('div');
            tabs.id = "window-workspace-tabs";
            document.getElementById('window-workspace').appendChild(tabs);
        }
        tabs.innerHTML = "";


        if (!this.containsTabID(id)){
            this.tabs.push(tab);
        }

        this.tabs.forEach((tab) => {
            let t = document.createElement('span');
            t.className = "tab";
            t.innerText = tab.id;
            let close = document.createElement('button');
            close.className = 'btn error';
            close.innerText = "X";
            t.appendChild(close);
            tabs.appendChild(t);
        });

        document.getElementById('window-workspace').appendChild(element);

        return element;

    }

}
