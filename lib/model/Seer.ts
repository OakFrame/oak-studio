
export class Seer{
   public signals = {}
   dataObj;
    constructor (dataObj) {
        this.dataObj=dataObj;
        this.observeData(dataObj);
    }

     observe (property, signalHandler) {
        if(!this.signals[property]) this.signals[property] = []
         this.signals[property].push(signalHandler);

        return this.dataObj;
    }

     notify (signal) {
        if(!this.signals[signal] || this.signals[signal].length < 1) return

         this.signals[signal].forEach((signalHandler) => signalHandler())
    }

     makeReactive (obj, key) {
        let val = obj[key]

        Object.defineProperty(obj, key, {
            get () {
                return val
            },
            set (newVal) {
                val = newVal
                this.notify(key)
            }
        })
    }

     observeData (obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                this.makeReactive(obj, key)
            }
        }
    }
}