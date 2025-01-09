
export class MyPromise{

    constructor(executor){
        this.toFulfill = [];
        this.toReject = [];
        this.resolved = false;
        this.locked = false;
        this.value = null;
        this.reason = null;
        this.backref = this;

        //console.log(executor)
        try{            
            executor(this.resolve.bind(this), this.reject.bind(this));
        }
        catch(Error){
            this.reject(Error("Executor crash"))
        }
    }
  
    resolve(val=undefined){
        if(this.locked) return;
        this.resolved = true;
        if(!val || !(val.then)){
            this.value = val;
            this.fulfill(this.value);
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
  
    reject(reason=undefined){
        if(this.locked) return;
        this.reason = reason;
        this.locked = true;
        this.toReject.forEach((callback) => queueMicrotask(callback));
    }
  
    fulfill(value=undefined){
      this.value = value
      this.locked = true
      this.toFulfill.forEach((callback) => queueMicrotask(callback))
    }
  
    then(onFulfill, onReject){  
      if(typeof onFulfill != 'function'){
        onFulfill = (val) => val
      }
      if(onReject && typeof onReject != 'function'){
        onReject = (reason) => {throw(reason);};
      }

      
      let outerProm = this

      return new Promise((resolve, reject) => {

        if(outerProm.value){
            queueMicrotask(() => {
                try{
                    resolve(onFulfill(this.value))
                }
                catch(err){
                    reject(err)
                }
            });
        }
        else if(outerProm.reason){
            queueMicrotask(() => {
                try{
                    reject(onReject(this.reason))
                }
                catch(error){
                    reject(error)
                }
            })     
        }

        if(onFulfill) this.toFulfill.push(() => {
            try{
                resolve(onFulfill(this.value)) 
            }
            catch(err){
                reject(err)
            }
            
        }
        )
        if(onReject) this.toReject.push(() =>
             {
                try{
                    reject(onReject(this.reason))
                }
                catch(error){
                    reject(error)
                }
            })  
        })
    }
  }