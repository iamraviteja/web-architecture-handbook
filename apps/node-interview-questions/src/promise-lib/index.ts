const STATE = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
};

export function PromisePolyfill(cb: any) {
    let _state: string = STATE.PENDING;
    let _value: any = null;
    let _thenCbs: any[] = [];
    let _catchCbs: any[] = [];

    this.then = _then.bind(this);
    this.catch = _catch.bind(this);

    try {
        cb(_onResolve, _onReject);
    } catch (error) {
        _onReject(error);
    }

    function _onResolve(value:any) {
        if(_state != STATE.PENDING) return;
        _state = STATE.FULFILLED;
        _value = value;
        _runCallbacks();
    }

    function _onReject(value:any) {
        if(_state != STATE.PENDING) return;
        _state = STATE.REJECTED;
        _value = value;
        _runCallbacks();
    }

    function _runCallbacks() {
        if(_state == STATE.FULFILLED){
            _thenCbs.forEach(cb => {
                cb(_value);
            });
            _thenCbs = [];
        }

        if(_state == STATE.REJECTED){
            _catchCbs.forEach(cb => {
                cb(_value);
            });
            _catchCbs = [];
        }
    }

    function _then(thenCb:any, catchCb:any) {
        if(thenCb)  _thenCbs.push(thenCb);
        if(catchCb) _catchCbs.push(catchCb);

        if(_state != STATE.PENDING){
            _runCallbacks();
        }
    }

    function _catch(cb:any) {
        this.then(null, cb);
    }
}