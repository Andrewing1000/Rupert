
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
            this.value = val;
            this.fulfill(this.value);
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
            return
        }
        this.toFulfill.push(handler)
    }

    queueReject(handler){
        if(!handler && typeof handler != 'function') return
        if(this.rejected){
            queueMicrotask(handler)
            return
        }
        this.toReject.push(handler)
    }

    then(onFulfill=undefined, onReject=undefined){  
        if(onReject === undefined) 
        return new MyPromise((resolve, reject) => {

            })
    }

    catch(onReject){
        return this.then(undefined, onReject);
    }

    finally(finallyHandler){
        return this.then(() => finallyHandler());
    }
  }