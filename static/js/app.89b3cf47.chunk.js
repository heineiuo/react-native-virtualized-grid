(this.webpackJsonp=this.webpackJsonp||[]).push([[0],{111:function(e,t,n){"use strict";n.d(t,"a",(function(){return Z}));var r=n(0),o=n(10),i=n(11),a=n(23),c=n(110),u=n(3),l=n(146),s=n(70),d=n(71),h=n(2);function f(){return Object(h.jsxs)(u.a,{style:{height:56,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},children:[Object(h.jsx)(u.a,{style:{paddingLeft:20},children:Object(h.jsx)(a.a,{style:{fontWeight:"bold",fontSize:20},children:"React Native Virtualized Grid"})}),Object(h.jsxs)(u.a,{style:{paddingRight:20,flexDirection:"row",alignItems:"center"},children:[Object(h.jsx)(s.a,{style:{marginRight:12},onPress:function(){d.a.openURL("https://twitter.com/770hz")},children:Object(h.jsx)(l.a,{name:"twitter",size:24,color:"#1d9bf0"})}),Object(h.jsx)(s.a,{onPress:function(){d.a.openURL("https://github.com/heineiuo/react-native-virtualized-grid")},children:Object(h.jsx)(l.a,{name:"github",size:24,color:"black"})})]})]})}var b=n(13),m=n.n(b),w=n(61),g=n.n(w),p=n(32),y=n(30);function j(e){var t=e.renderCell,n=e.column,r=e.row;return Object(h.jsx)(o.a.View,{style:{position:"absolute",width:n.widthAnimated,zIndex:o.a.add(n.zIndexAnimated,r.zIndexAnimated),height:r.heightAnimated,transform:[{translateX:n.xAnimated},{translateY:r.yAnimated}]},children:t({column:n,row:r})})}var O=Object(r.createContext)({}),x=function(){return Object(r.useContext)(O)},v=n(15),I=n.n(v),A=n(16),C=n.n(A);var R=function(){function e(){I()(this,e),this._x=0,this._y=0,this.xAnimated=new o.a.Value(0),this.yAnimated=new o.a.Value(0),this.rowIndex=0,this.columnIndex=0,this.left=0,this.top=0}return C()(e,[{key:"x",get:function(){return this._x},set:function(e){this._x=e,this.xAnimated.setValue(e)}},{key:"y",get:function(){return this._y},set:function(e){this._y=e,this.yAnimated.setValue(e)}}]),e}(),P=function(){function e(){I()(this,e),this._offsetX=0,this._offsetY=0,this.offsetXAnimated=new o.a.Value(0),this.offsetYAnimated=new o.a.Value(0),this._width=0,this._height=0,this.widthAnimated=new o.a.Value(0),this.heightAnimated=new o.a.Value(0)}return C()(e,[{key:"offsetX",get:function(){return this._offsetX},set:function(e){this._offsetX=0,this.offsetXAnimated.setValue(e)}},{key:"offsetY",get:function(){return this._offsetY},set:function(e){this._offsetY=0,this.offsetYAnimated.setValue(e)}},{key:"width",get:function(){return this._width},set:function(e){this._width=0,this.widthAnimated.setValue(e)}},{key:"height",get:function(){return this._height},set:function(e){this._height=0,this.heightAnimated.setValue(e)}}]),e}(),S=function(){function e(t){var n=t.x,r=t.width,i=t.columnIndex,a=t.freezed,c=void 0!==a&&a;I()(this,e),this.xAnimated=new o.a.Value(n),this.widthAnimated=new o.a.Value(r),this.columnIndex=i,this.freezed=c,this.zIndexAnimated=new o.a.Value(c?1:0),this.highlightOpacityAnimated=new o.a.Value(0)}return C()(e,[{key:"x",get:function(){return JSON.parse(JSON.stringify(this.xAnimated))}},{key:"width",get:function(){return JSON.parse(JSON.stringify(this.widthAnimated))}}]),e}(),z=function(){function e(t){var n=t.y,r=t.height,i=t.rowIndex,a=t.freezed,c=void 0!==a&&a;I()(this,e),this.yAnimated=new o.a.Value(n),this.heightAnimated=new o.a.Value(r),this.rowIndex=i,this.freezed=c,this.zIndexAnimated=new o.a.Value(c?1:0),this.highlightOpacityAnimated=new o.a.Value(0)}return C()(e,[{key:"y",get:function(){return JSON.parse(JSON.stringify(this.yAnimated))}},{key:"height",get:function(){return JSON.parse(JSON.stringify(this.heightAnimated))}}]),e}();!function(){function e(t){var n=t.column,o=t.row;I()(this,e),this.column=n,this.row=o,this.ref=Object(r.createRef)()}C()(e,[{key:"x",get:function(){return this.column.x}},{key:"y",get:function(){return this.row.y}},{key:"width",get:function(){return this.column.width}},{key:"height",get:function(){return this.row.height}}])}();function V(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function k(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?V(Object(n),!0).forEach((function(t){m()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):V(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function E(e,t){var n="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"===typeof e)return M(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return M(e,t)}(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function M(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function D(e){var t,n,o=e.debug,a=void 0!==o&&o,c=e.style,l=(e.columnCount,e.rowCount,e.renderCell),s=e.onChangeColumn,d=void 0===s?function(e){}:s,f=e.onChangeRow,b=void 0===f?function(e){}:f,m=e.getColumnWidth,w=void 0===m?function(){return 100}:m,x=e.getRowHeight,v=void 0===x?function(){return 40}:x,I=e.freezedColumns,A=void 0===I?{}:I,C=e.freezedRows,V=void 0===C?{}:C,M=e.onChangeColumnOrder,D=void 0===M?function(){}:M,_=e.onChangeRowOrder,X=void 0===_?function(){}:_,T=e.onChangeVisibleArea,Y=void 0===T?function(){}:T,N=e.useScrollView,J=void 0!==N&&N,L=Object(r.useRef)(null),G=(Object(r.useRef)(null),null!=(t=A.start)?t:0),W=null!=(n=V.start)?n:0,H=Object(r.useRef)([]),U=Object(r.useRef)([]),q=Object(r.useState)({notFreezed:{},columnFreezed:{},rowFreezed:{},allFreezed:{}}),$=g()(q,2),B=$[0],K=$[1],Q=Object(r.useRef)(new R),Z=Object(r.useRef)({width:0,height:0}),ee=(Object(r.useRef)(new P),Object(r.useCallback)((function(){a&&console.time("update");var e=Z.current,t=e.width,n=e.height,r=Q.current,o=r.rowIndex,i=r.columnIndex,c=r.left,u=r.top,s=r.x,d=r.y,f=c,b=u,m=i,g=o,p=[],y=[],O=null,x=null,I=null,A=null;if(G>0&&m>G-1)for(var C=0,R=0;C<G;){var P=w({columnIndex:C});y.push(new S({columnIndex:C,width:P,x:R,freezed:!0})),C++,R+=P}for(;;){var V=w({columnIndex:m});if(y.push(new S({columnIndex:m,width:V,x:f,freezed:m<G})),O||(O=y.slice(-1)[0]),m++,(f+=V)>-s+t){x=y.slice(-1)[0];break}}if(W>0&&g>W-1)for(var k=0,M=0;k<W;){var D=v({rowIndex:k});p.push(new z({rowIndex:k,height:D,y:M,freezed:!0})),k++,M+=D}for(;;){var F=v({rowIndex:g});if(p.push(new z({rowIndex:g,height:F,y:b,freezed:g<W})),I||(I=p.slice(-1)[0]),g++,(b+=F)>-d+n){A=p.slice(-1)[0];break}}H.current=y,U.current=p;for(var _=[],X=[],T=[],N=[],J=0,L=p;J<L.length;J++)for(var q,$=L[J],B=E(y);!(q=B()).done;){var ee=q.value,te=Object(h.jsx)(j,{column:ee,row:$,renderCell:l},ee.columnIndex+"/"+$.rowIndex);ee.freezed&&$.freezed?_.push(te):ee.freezed?T.push(te):$.freezed?N.push(te):X.push(te)}a&&(console.timeEnd("update"),console.log("count",y.length,p.length,y.length*p.length),console.time("setCells")),Y({minRow:I,minColumn:O,maxRow:A,maxColumn:x}),K({notFreezed:{children:X,x:!0,y:!0},columnFreezed:{children:T,y:!0},rowFreezed:{children:N,x:!0},allFreezed:{children:_}}),a&&console.timeEnd("setCells")}),[a,Y,w,v,l,G,W])),te=Object(r.useCallback)((function(e){var t=e.nativeEvent.layout,n=t.width,r=t.height;Z.current.width=n,Z.current.height=r,ee()}),[ee]),ne=Object(r.useCallback)((function(e){a&&console.time("updateCoordinate");var t=e.deltaX,n=e.deltaY,r=Q.current,o=r.columnIndex,i=r.rowIndex,c=r.left,u=r.top,l=Q.current.x-t;if(l>0)l=0,Q.current.x=0,Q.current.columnIndex=0,Q.current.left=0;else{Q.current.x=l;var s=o,d=c,h=c;if(t>0){for(;;){if(d=h,(h+=w({columnIndex:s}))>=-l)break;s++}Q.current.columnIndex=s,Q.current.left=d}else{for(;!(d<=-l);){s--,d-=w({columnIndex:s})}Q.current.columnIndex=s,Q.current.left=d}}var f=Q.current.y-n;if(f>0)f=0,Q.current.y=0,Q.current.top=0,Q.current.rowIndex=0;else{Q.current.y=f;var b=i,m=u,g=u;if(n>0){for(;;){if(m=g,(g+=v({rowIndex:b}))>=-f)break;b++}Q.current.rowIndex=b,Q.current.top=m}else{for(;!(m<=-f);){b--,m-=v({rowIndex:b})}Q.current.rowIndex=b,Q.current.top=m}}a&&(console.log(Q.current),console.timeEnd("updateCoordinate")),ee()}),[ee,a,w,v]),re=Object(r.useMemo)((function(){var e=null,t=0,n=0;return function(r){clearTimeout(e);var o=r.deltaX,i=r.deltaY;t+=o,n+=i,e=setTimeout((function(){ne({deltaX:t,deltaY:n}),t=0,n=0}),0)}}),[ne]),oe=Object(r.useCallback)((function(e){var t=e.nativeEvent.contentOffset,n=t.x,r=t.y;Q.current.y=-r,Q.current.x=-n,setTimeout(ee,0)}),[ee]);Object(r.useEffect)((function(){if(!J&&"web"===i.a.OS){var e=L.current;if(e)return e.addEventListener("wheel",re),function(){e.removeEventListener("wheel",re)}}}),[J,re]);var ie=Object(r.useMemo)((function(){var e=null,t=null,n=0,r=0,o=0,i=0,a=Date.now(),c=0,u=0,l=0,s=0;function d(){l=0,s=0,o=0,i=0,c=0,u=0,a=Date.now(),clearInterval(t),t=setInterval(h,20)}function h(){var e=Date.now(),t=e-a+1;a=e,c=.8*(200*o/t)+.2*c,u=.8*(200*i/t)+.2*u,o=0,i=0}function f(){var e=Date.now()-a,t=Math.exp(-e/325),n=l*t,r=s*t;n>.5||n<-.5||r>.5||r<-.5?(ne({deltaX:n,deltaY:r}),requestAnimationFrame(f)):ne({deltaX:n,deltaY:r})}return p.a.create({onMoveShouldSetPanResponder:function(){return!0},onPanResponderGrant:function(t,n){e=k({},n),d()},onPanResponderMove:function(t,a){if(!e)return e=k({},a),void d();n=-a.dx+e.dx,r=-a.dy+e.dy,o=n,i=r,e=k({},a),ne({deltaX:n,deltaY:r})},onPanResponderRelease:function(){e=null,clearInterval(t),(c>10||c<-10)&&(l=.8*c),(u>10||u<-10)&&(s=.8*u),a=Date.now(),requestAnimationFrame(f)}})}),[ne]);return Object(h.jsx)(O.Provider,{value:{virtualColumns:H,virtualRows:U,onChangeColumn:d,onChangeRow:b,coordinate:Q,containerSize:Z,updateCoordinate:ne,onChangeColumnOrder:D,onChangeRowOrder:X},children:Object(h.jsxs)(u.a,k(k({ref:L,style:[{overflow:"hidden"},c],onLayout:te},J?{}:ie.panHandlers),{},{children:[!J&&Object(h.jsx)(F,{translateX:Q.current.xAnimated,translateY:Q.current.yAnimated,children:B.notFreezed.children}),J&&Object(h.jsx)(y.a,{style:{position:"absolute",top:40,left:50,right:0,bottom:0,overflow:"scroll"},scrollEventThrottle:1,onScroll:oe,children:Object(h.jsx)(u.a,{style:{width:1e4,height:1e4},children:Object(h.jsx)(u.a,{style:[{position:"absolute",top:-40,left:-50}],children:B.notFreezed.children})})}),Object(h.jsx)(F,{translateY:Q.current.yAnimated,children:B.columnFreezed.children}),Object(h.jsx)(F,{translateX:Q.current.xAnimated,children:B.rowFreezed.children}),Object(h.jsx)(F,{children:B.allFreezed.children})]}))})}function F(e){var t=e.translateX,n=void 0===t?0:t,r=e.translateY,i=void 0===r?0:r,a=e.children;return Object(h.jsx)(o.a.View,{style:[{position:"absolute",transform:[{translateX:n},{translateY:i}]}],children:a})}var _=n(64);function X(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function T(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?X(Object(n),!0).forEach((function(t){m()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):X(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function Y(e,t){var n="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"===typeof e)return N(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return N(e,t)}(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function N(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function J(e){var t=e.column,n=e.row,i=x(),a=i.virtualColumns,c=i.onChangeColumn,u=Object(r.useMemo)((function(){var e=[];return p.a.create({onPanResponderTerminate:function(e,t){},onPanResponderTerminationRequest:function(e,t){return!1},onPanResponderReject:function(){},onMoveShouldSetPanResponder:function(e,t){return!0},onPanResponderGrant:function(){t.widthAnimated.setOffset(t.width),e=[];for(var n,r=Y(a.current);!(n=r()).done;){var o=n.value;o.columnIndex>t.columnIndex&&(e.push(o),o.xAnimated.setOffset(o.x))}},onPanResponderMove:function(n,r){for(var o,i=Y(e);!(o=i()).done;){o.value.xAnimated.setValue(r.dx)}t.widthAnimated.setValue(r.dx),c(t)},onPanResponderRelease:function(){t.widthAnimated.flattenOffset();for(var n,r=Y(e);!(n=r()).done;){n.value.xAnimated.flattenOffset()}e=[]}})}),[t,a,c]);return Object(h.jsx)(o.a.View,T(T({},u.panHandlers),{},{style:[{position:"absolute",top:0,right:0,zIndex:10,height:n.height,width:20}],children:Object(h.jsx)(_.a,{style:[{display:"flex",alignItems:"flex-end",height:n.height}],children:function(e){var t=e.hovered;return Object(h.jsx)(o.a.View,{style:[{height:n.heightAnimated,width:0},t&&{width:5,backgroundColor:"blue"}]})}})}))}function L(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function G(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?L(Object(n),!0).forEach((function(t){m()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):L(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function W(e,t){var n="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"===typeof e)return H(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return H(e,t)}(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function H(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function U(e){var t=e.column,n=e.row,i=e.children,a=x(),c=a.virtualColumns,u=a.onChangeColumnOrder,l=Object(r.useMemo)((function(){var e=0,n=null,r=0;return p.a.create({onPanResponderTerminate:function(e,t){},onPanResponderTerminationRequest:function(e,t){return!1},onPanResponderReject:function(){},onMoveShouldSetPanResponder:function(e,t){return!0},onPanResponderGrant:function(n){e=t.x+n.nativeEvent.locationX,r=t.columnIndex},onPanResponderMove:function(t,r){for(var o,i=W(c.current);!(o=i()).done;){var a=o.value,u=a.x+a.width/2;if(Math.abs(u-e-r.dx)<a.width/2){if(console.log("highlightcolumn",a.columnIndex),n===a)break;n&&n.highlightOpacityAnimated.setValue(0),(n=a).highlightOpacityAnimated.setValue(1);break}}},onPanResponderRelease:function(){n&&(n.highlightOpacityAnimated.setValue(0),r!==n.columnIndex&&u({fromIndex:r,toIndex:n.columnIndex}))}})}),[t,u,c]);return Object(h.jsx)(o.a.View,G(G({},l.panHandlers),{},{style:[{position:"absolute",zIndex:8,top:0,left:0,height:n.height,width:t.width}],children:i}))}function q(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function $(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?q(Object(n),!0).forEach((function(t){m()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):q(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function B(e,t){var n="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"===typeof e)return K(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return K(e,t)}(e))||t&&e&&"number"===typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function K(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function Q(e){var t=e.column,n=e.row,i=x(),a=i.virtualRows,c=i.onChangeRow,u=Object(r.useMemo)((function(){var e=[];return p.a.create({onPanResponderTerminate:function(e,t){},onPanResponderTerminationRequest:function(e,t){return!1},onPanResponderReject:function(){},onMoveShouldSetPanResponder:function(e,t){return!0},onPanResponderGrant:function(){n.heightAnimated.setOffset(n.height),e=[];for(var t,r=B(a.current);!(t=r()).done;){var o=t.value;o.rowIndex>n.rowIndex&&(e.push(o),o.yAnimated.setOffset(o.y))}},onPanResponderMove:function(t,r){for(var o,i=B(e);!(o=i()).done;){o.value.yAnimated.setValue(r.dy)}n.heightAnimated.setValue(r.dy),c(n)},onPanResponderRelease:function(){n.heightAnimated.flattenOffset();for(var t,r=B(e);!(t=r()).done;){t.value.yAnimated.flattenOffset()}e=[]}})}),[n,a,c]);return Object(h.jsx)(o.a.View,$($({},u.panHandlers),{},{style:[{position:"absolute",bottom:0,left:0,zIndex:10,height:20,width:t.width}],children:Object(h.jsx)(_.a,{style:[{display:"flex",justifyContent:"flex-end",width:t.width,height:20}],children:function(e){var n=e.hovered;return Object(h.jsx)(o.a.View,{style:[{width:t.widthAnimated,height:0},n&&{height:5,backgroundColor:"blue"}]})}})}))}function Z(){var e=Object(c.a)(),t=e.width,n=e.height,l=Object(r.useRef)(new Map),s=Object(r.useRef)(new Map),d=Object(r.useCallback)((function(e){l.current.set(""+e.columnIndex,e.width)}),[]),b=Object(r.useCallback)((function(e){s.current.set(""+e.rowIndex,e.height)}),[]),m=Object(r.useCallback)((function(e){console.log(e)}),[]);return Object(r.useLayoutEffect)((function(){"web"===i.a.OS&&(document.body.style.overflow="hidden")}),[]),Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(f,{}),Object(h.jsx)(D,{debug:!1,columnCount:Number.MAX_SAFE_INTEGER,rowCount:Number.MAX_SAFE_INTEGER,freezedColumns:{start:1},freezedRows:{start:1},style:[{borderColor:"#fff",width:t,height:n-56},i.a.select({web:{userSelect:"none"}})],getColumnWidth:function(e){if(l.current.has(""+e.columnIndex))return l.current.get(""+e.columnIndex);Math.round(100*Math.random());return[50,140,200,120][e.columnIndex%4]},getRowHeight:function(e){if(s.current.has(""+e.rowIndex))return s.current.get(""+e.rowIndex);Math.round(100*Math.random());return[40,50,60,90,40,45,40,50,55,50][e.rowIndex%10]},onChangeColumn:d,onChangeColumnOrder:m,onChangeRow:b,onChangeVisibleArea:function(e){},renderCell:function(e){var t=e.column,n=e.row;return Object(h.jsxs)(u.a,{style:{flex:1,backgroundColor:n.rowIndex%2===1?"rgb(246, 248, 250)":"#fff",borderTopWidth:1,borderLeftWidth:1,borderColor:"rgb(216, 222, 228)",padding:4,borderRightWidth:0===t.columnIndex?1:0,borderBottomWidth:0===n.rowIndex?1:0},children:[0===t.columnIndex&&0===n.rowIndex&&null,0===n.rowIndex&&t.columnIndex>0&&Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(U,{row:n,column:t,children:Object(h.jsxs)(h.Fragment,{children:[Object(h.jsxs)(a.a,{children:["c: ",t.columnIndex]}),Object(h.jsxs)(a.a,{children:["r: ",n.rowIndex]})]})}),Object(h.jsx)(J,{row:n,column:t})]}),0===t.columnIndex&&n.rowIndex>0&&Object(h.jsxs)(h.Fragment,{children:[Object(h.jsxs)(h.Fragment,{children:[Object(h.jsxs)(a.a,{children:["c: ",t.columnIndex]}),Object(h.jsxs)(a.a,{children:["r: ",n.rowIndex]})]}),Object(h.jsx)(Q,{row:n,column:t})]}),t.columnIndex>0&&n.rowIndex>0&&Object(h.jsxs)(h.Fragment,{children:[Object(h.jsxs)(a.a,{children:["c: ",t.columnIndex]}),Object(h.jsxs)(a.a,{children:["r: ",n.rowIndex]})]}),Object(h.jsx)(o.a.View,{style:[{position:"absolute",left:0,top:-1,bottom:-1,width:2,backgroundColor:"blue",opacity:t.highlightOpacityAnimated},i.a.select({web:{pointerEvents:"none"}})]})]})}})]})}},113:function(e,t,n){e.exports=n(139)}},[[113,1,2]]]);
//# sourceMappingURL=app.89b3cf47.chunk.js.map