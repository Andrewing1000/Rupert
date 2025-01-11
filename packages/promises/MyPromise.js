
export class MyPromise{

    constructor(executor){
        this.toFulfill = [];
        this.toReject = [];
        this.resolved = false;
        this.value = null;
        this.reason = null;

        try{executor(this.resolve.bind(this), this.reject.bind(this));}
        catch(err){this.reject(err)}
    }
    get fulfilled() {return this.value!==null}
    get rejected() {return this.reason!==null}
    get locked() {return  (this.fulfilled || this.rejected)}
    resolve(val=undefined){
        if(this.locked) return;
        this.resolved = true;
        if(!val || !(val.then)){
            this.fulfill(val);
            return;
        }
        try{
            val.then(
            (value) => this.resolve(value),
            (value) => this.reject(value) )
        }
        catch(error){
            this.reject(error)
        }
    }

    fulfill(value=undefined){
        if(this.locked) return;
        this.value = value
        this.toFulfill.forEach((callback) => queueMicrotask(callback))
    }
  
    reject(reason=undefined){
        if(this.locked) return;
        this.reason = reason;
        this.toReject.forEach((callback) => queueMicrotask(callback));
    }  
  
    queueFulfill(handler){
        if(!handler && typeof handler != 'function') return
        if(this.fulfilled){
            queueMicrotask(handler)
            return;
        }
        this.toFulfill.push(handler)
    }

    queueReject(handler){
        if(!handler && typeof handler != 'function') return
        if(this.rejected){
            queueMicrotask(handler)
            return;
        }
        this.toReject.push(handler)
    }

    then(onFulfill=undefined, onReject=undefined){  
        return new MyPromise((resolve, reject) => {
                if(onFulfill && (typeof onFulfill) !== 'function') onFulfill = (x) => x;
                if(onFulfill) this.queueFulfill(() => {
                    try{resolve(onFulfill(this.value));}
                    catch(err){reject(err)};
                })
                    
                if(onReject === undefined) this.queueReject(() => reject(this.reason))
                if(onReject !== null && (typeof onReject) !== 'function') onReject = (x) => {throw x};
                if(onReject) this.queueReject(() => {
                    try{resolve(onReject(this.reason))}
                    catch(err){reject(err)}
                })
            })
    }

    catch(onReject){
        return this.then(undefined, onReject);
    }

    finally(finallyHandler){
        return this.then(
            (val) => {
                let res = finallyHandler()
                if(res?.then) return res.then((_)=>val)  
                return val;
            },
            (err) => {finallyHandler(); throw err})
    }

    static resolve(value){
        if(value.constructor === MyPromise || value.constructor === Promise) return value;
        return new MyPromise((resolve) => resolve(value))
    }

    static reject(value){
        return new MyPromise((_, reject) => reject(value))
    }

    static all(list){
        return new MyPromise((resolve, reject) => {
            if(list?.length == 0){
                resolve([])
                return;
            }
            let resolutions = Array(list.length);
            let count = 0;
            list.forEach((prom, index) => {
                prom = MyPromise.resolve(prom)
                prom.then((val) => {
                    resolutions[index] = val
                    count++;
                    if(count === list.length) resolve(resolutions)
                },
                (err) => reject(err))
            })
        })
    }

    static allSettled(list){
        return new Promise((resolve, reject) => {
            if(list?.length == 0){
                resolve([])
                return;
            }
            let settlements = Array(list.length)
            let count = 0;
            list.forEach((prom, index) => {
                prom = MyPromise.resolve(prom)
                prom.then((val) => {
                    settlements[index] = {"status": "fulfilled", value: val}
                    count++;
                },
                (val) => {
                    settlements[index] = {"status":"rejected", reason: val}
                    count++;
                }).finally(() => count===list.length? resolve(settlements): false)
            })
        })
    }

    static any(list){
        return new MyPromise((resolve, reject) => {
            if(list?.length == 0){
                reject(new AggregateError([]))
                return;
            }
            let rejections = Array(list.length)
            let count = 0
            list.forEach((prom, index) => {
                prom = MyPromise.resolve(prom)
                prom.then(
                    (val) =>{
                        resolve(val)
                    },
                    (err) => {
                        rejections[index] = err
                        count++;
                        if(count===list.length) reject(new AggregateError(rejections))
                    }
                )
            })
        })
    }

    static race(list){
        return new MyPromise((resolve, reject) => {
            list.forEach((prom, index) => {
                prom = MyPromise.resolve(prom)
                prom.then(resolve, reject)
            })
        })
    }

    static try(func, ...args){
        return new MyPromise((resolve, reject) => {
            try{resolve(func(args))}
            catch(err){reject(err)}
        })
    }

    static withResolvers(){
        let obj = {}
        const prom = new MyPromise((resolve, reject) => {
            obj["resolve"] = resolve
            obj["reject"] = reject
        })
        obj["promise"] = prom
        return obj
    }
  }