(module
 (type $i32_=>_none (func (param i32)))
 (type $f32_=>_f32 (func (param f32) (result f32)))
 (type $none_=>_none (func))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_i32_i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32 i32 i32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i64_=>_none (func (param i32 i32 i64)))
 (type $none_=>_i32 (func (result i32)))
 (type $f32_f32_=>_f32 (func (param f32 f32) (result f32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_i32_=>_f32 (func (param i32 i32) (result f32)))
 (type $i32_i32_f32_=>_none (func (param i32 i32 f32)))
 (type $i32_f32_f32_=>_i32 (func (param i32 f32 f32) (result i32)))
 (type $i32_i32_f32_f32_=>_i32 (func (param i32 i32 f32 f32) (result i32)))
 (type $i32_i32_i32_f32_f32_=>_i32 (func (param i32 i32 i32 f32 f32) (result i32)))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $~argumentsLength (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/total (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/threshold (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/state (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/visitCount (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/pinSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/iter (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/toSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/white (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/math/rempio2f_y (mut f64) (f64.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 1792))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 34588))
 (memory $0 1)
 (data $0 (i32.const 1036) ",")
 (data $0.1 (i32.const 1048) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $1 (i32.const 1084) "<")
 (data $1.1 (i32.const 1096) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data $2 (i32.const 1148) "<")
 (data $2.1 (i32.const 1160) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $3 (i32.const 1212) "<")
 (data $3.1 (i32.const 1224) "\02\00\00\00 \00\00\00~\00l\00i\00b\00/\00r\00t\00/\00i\00t\00c\00m\00s\00.\00t\00s")
 (data $6 (i32.const 1340) "<")
 (data $6.1 (i32.const 1352) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $7 (i32.const 1404) ",")
 (data $7.1 (i32.const 1416) "\02\00\00\00\14\00\00\00~\00l\00i\00b\00/\00r\00t\00.\00t\00s")
 (data $9 (i32.const 1484) "<")
 (data $9.1 (i32.const 1496) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s")
 (data $10 (i32.const 1548) "<")
 (data $10.1 (i32.const 1560) "\02\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $11 (i32.const 1616) ")\15DNn\83\f9\a2\c0\dd4\f5\d1W\'\fcA\90C<\99\95b\dba\c5\bb\de\abcQ\fe")
 (data $12 (i32.const 1660) "<")
 (data $12.1 (i32.const 1672) "\02\00\00\00*\00\00\00O\00b\00j\00e\00c\00t\00 \00a\00l\00r\00e\00a\00d\00y\00 \00p\00i\00n\00n\00e\00d")
 (data $13 (i32.const 1724) "<")
 (data $13.1 (i32.const 1736) "\02\00\00\00(\00\00\00O\00b\00j\00e\00c\00t\00 \00i\00s\00 \00n\00o\00t\00 \00p\00i\00n\00n\00e\00d")
 (data $14 (i32.const 1792) "\06\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00A\00\00\00\01\19")
 (export "__new" (func $~lib/rt/itcms/__new))
 (export "__pin" (func $~lib/rt/itcms/__pin))
 (export "__unpin" (func $~lib/rt/itcms/__unpin))
 (export "__collect" (func $~lib/rt/itcms/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "memory" (memory $0))
 (export "__setArgumentsLength" (func $~setArgumentsLength))
 (export "geometricmapfilter" (func $export:src/asm/geometricmapfilter/geometricmapfilter@varargs))
 (start $~start)
 (func $~lib/rt/itcms/visitRoots
  (local $0 i32)
  (local $1 i32)
  i32.const 1360
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1056
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1168
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1680
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1744
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  global.get $~lib/rt/itcms/pinSpace
  local.tee $1
  i32.load $0 offset=4
  i32.const -4
  i32.and
  local.set $0
  loop $while-continue|0
   local.get $0
   local.get $1
   i32.ne
   if
    local.get $0
    i32.load $0 offset=4
    i32.const 3
    i32.and
    i32.const 3
    i32.ne
    if
     i32.const 0
     i32.const 1232
     i32.const 160
     i32.const 16
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 20
    i32.add
    call $~lib/rt/__visit_members
    local.get $0
    i32.load $0 offset=4
    i32.const -4
    i32.and
    local.set $0
    br $while-continue|0
   end
  end
 )
 (func $~lib/rt/itcms/Object#unlink (param $0 i32)
  (local $1 i32)
  local.get $0
  i32.load $0 offset=4
  i32.const -4
  i32.and
  local.tee $1
  i32.eqz
  if
   local.get $0
   i32.load $0 offset=8
   i32.eqz
   local.get $0
   i32.const 34588
   i32.lt_u
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 1232
    i32.const 128
    i32.const 18
    call $~lib/builtins/abort
    unreachable
   end
   return
  end
  local.get $0
  i32.load $0 offset=8
  local.tee $0
  i32.eqz
  if
   i32.const 0
   i32.const 1232
   i32.const 132
   i32.const 16
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $0
  i32.store $0 offset=8
  local.get $0
  local.get $1
  local.get $0
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store $0 offset=4
 )
 (func $~lib/rt/itcms/Object#makeGray (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  global.get $~lib/rt/itcms/iter
  i32.eq
  if
   local.get $0
   i32.load $0 offset=8
   local.tee $1
   i32.eqz
   if
    i32.const 0
    i32.const 1232
    i32.const 148
    i32.const 30
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   global.set $~lib/rt/itcms/iter
  end
  local.get $0
  call $~lib/rt/itcms/Object#unlink
  global.get $~lib/rt/itcms/toSpace
  local.set $1
  local.get $0
  i32.load $0 offset=12
  local.tee $2
  i32.const 2
  i32.le_u
  if (result i32)
   i32.const 1
  else
   local.get $2
   i32.const 1792
   i32.load $0
   i32.gt_u
   if
    i32.const 1360
    i32.const 1424
    i32.const 21
    i32.const 28
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   i32.const 2
   i32.shl
   i32.const 1796
   i32.add
   i32.load $0
   i32.const 32
   i32.and
  end
  local.set $3
  local.get $1
  i32.load $0 offset=8
  local.set $2
  local.get $0
  global.get $~lib/rt/itcms/white
  i32.eqz
  i32.const 2
  local.get $3
  select
  local.get $1
  i32.or
  i32.store $0 offset=4
  local.get $0
  local.get $2
  i32.store $0 offset=8
  local.get $2
  local.get $0
  local.get $2
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store $0 offset=4
  local.get $1
  local.get $0
  i32.store $0 offset=8
 )
 (func $~lib/rt/tlsf/removeBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $1
  i32.load $0
  local.tee $2
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 268
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.const -4
  i32.and
  local.tee $2
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 1504
   i32.const 270
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $4
   i32.const 7
   i32.sub
   local.set $3
   local.get $2
   local.get $4
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  i32.const 16
  i32.lt_u
  local.get $3
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 284
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load $0 offset=8
  local.set $5
  local.get $1
  i32.load $0 offset=4
  local.tee $4
  if
   local.get $4
   local.get $5
   i32.store $0 offset=8
  end
  local.get $5
  if
   local.get $5
   local.get $4
   i32.store $0 offset=4
  end
  local.get $1
  local.get $0
  local.get $3
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=96
  i32.eq
  if
   local.get $0
   local.get $3
   i32.const 4
   i32.shl
   local.get $2
   i32.add
   i32.const 2
   i32.shl
   i32.add
   local.get $5
   i32.store $0 offset=96
   local.get $5
   i32.eqz
   if
    local.get $0
    local.get $3
    i32.const 2
    i32.shl
    i32.add
    local.tee $1
    i32.load $0 offset=4
    i32.const -2
    local.get $2
    i32.rotl
    i32.and
    local.set $2
    local.get $1
    local.get $2
    i32.store $0 offset=4
    local.get $2
    i32.eqz
    if
     local.get $0
     local.get $0
     i32.load $0
     i32.const -2
     local.get $3
     i32.rotl
     i32.and
     i32.store $0
    end
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $1
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 201
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.load $0
  local.tee $3
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 203
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 4
  i32.add
  local.get $1
  i32.load $0
  i32.const -4
  i32.and
  i32.add
  local.tee $4
  i32.load $0
  local.tee $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $4
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $3
   i32.const 4
   i32.add
   local.get $2
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store $0
   local.get $1
   i32.const 4
   i32.add
   local.get $1
   i32.load $0
   i32.const -4
   i32.and
   i32.add
   local.tee $4
   i32.load $0
   local.set $2
  end
  local.get $3
  i32.const 2
  i32.and
  if
   local.get $1
   i32.const 4
   i32.sub
   i32.load $0
   local.tee $1
   i32.load $0
   local.tee $6
   i32.const 1
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 1504
    i32.const 221
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $0
   local.get $1
   call $~lib/rt/tlsf/removeBlock
   local.get $1
   local.get $6
   i32.const 4
   i32.add
   local.get $3
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   i32.store $0
  end
  local.get $4
  local.get $2
  i32.const 2
  i32.or
  i32.store $0
  local.get $3
  i32.const -4
  i32.and
  local.tee $2
  i32.const 12
  i32.lt_u
  if
   i32.const 0
   i32.const 1504
   i32.const 233
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $1
  i32.const 4
  i32.add
  local.get $2
  i32.add
  i32.ne
  if
   i32.const 0
   i32.const 1504
   i32.const 234
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 4
  i32.sub
  local.get $1
  i32.store $0
  local.get $2
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $2
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   i32.const 1073741820
   local.get $2
   local.get $2
   i32.const 1073741820
   i32.ge_u
   select
   local.tee $2
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $5
   local.get $2
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $2
  i32.const 16
  i32.lt_u
  local.get $5
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 251
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=96
  local.set $3
  local.get $1
  i32.const 0
  i32.store $0 offset=4
  local.get $1
  local.get $3
  i32.store $0 offset=8
  local.get $3
  if
   local.get $3
   local.get $1
   i32.store $0 offset=4
  end
  local.get $0
  local.get $5
  i32.const 4
  i32.shl
  local.get $2
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store $0 offset=96
  local.get $0
  local.get $0
  i32.load $0
  i32.const 1
  local.get $5
  i32.shl
  i32.or
  i32.store $0
  local.get $0
  local.get $5
  i32.const 2
  i32.shl
  i32.add
  local.tee $0
  local.get $0
  i32.load $0 offset=4
  i32.const 1
  local.get $2
  i32.shl
  i32.or
  i32.store $0 offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $0 i32) (param $1 i32) (param $2 i64)
  (local $3 i32)
  (local $4 i32)
  local.get $2
  local.get $1
  i64.extend_i32_u
  i64.lt_u
  if
   i32.const 0
   i32.const 1504
   i32.const 382
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.set $1
  local.get $0
  i32.load $0 offset=1568
  local.tee $4
  if
   local.get $4
   i32.const 4
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 1504
    i32.const 389
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   i32.const 16
   i32.sub
   local.get $4
   i32.eq
   if
    local.get $4
    i32.load $0
    local.set $3
    local.get $1
    i32.const 16
    i32.sub
    local.set $1
   end
  else
   local.get $0
   i32.const 1572
   i32.add
   local.get $1
   i32.gt_u
   if
    i32.const 0
    i32.const 1504
    i32.const 402
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $2
  i32.wrap_i64
  i32.const -16
  i32.and
  local.get $1
  i32.sub
  local.tee $4
  i32.const 20
  i32.lt_u
  if
   return
  end
  local.get $1
  local.get $3
  i32.const 2
  i32.and
  local.get $4
  i32.const 8
  i32.sub
  local.tee $3
  i32.const 1
  i32.or
  i32.or
  i32.store $0
  local.get $1
  i32.const 0
  i32.store $0 offset=4
  local.get $1
  i32.const 0
  i32.store $0 offset=8
  local.get $1
  i32.const 4
  i32.add
  local.get $3
  i32.add
  local.tee $3
  i32.const 2
  i32.store $0
  local.get $0
  local.get $3
  i32.store $0 offset=1568
  local.get $0
  local.get $1
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tlsf/initialize
  (local $0 i32)
  (local $1 i32)
  memory.size $0
  local.tee $1
  i32.const 0
  i32.le_s
  if (result i32)
   i32.const 1
   local.get $1
   i32.sub
   memory.grow $0
   i32.const 0
   i32.lt_s
  else
   i32.const 0
  end
  if
   unreachable
  end
  i32.const 34592
  i32.const 0
  i32.store $0
  i32.const 36160
  i32.const 0
  i32.store $0
  loop $for-loop|0
   local.get $0
   i32.const 23
   i32.lt_u
   if
    local.get $0
    i32.const 2
    i32.shl
    i32.const 34592
    i32.add
    i32.const 0
    i32.store $0 offset=4
    i32.const 0
    local.set $1
    loop $for-loop|1
     local.get $1
     i32.const 16
     i32.lt_u
     if
      local.get $0
      i32.const 4
      i32.shl
      local.get $1
      i32.add
      i32.const 2
      i32.shl
      i32.const 34592
      i32.add
      i32.const 0
      i32.store $0 offset=96
      local.get $1
      i32.const 1
      i32.add
      local.set $1
      br $for-loop|1
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  i32.const 34592
  i32.const 36164
  memory.size $0
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  i32.const 34592
  global.set $~lib/rt/tlsf/ROOT
 )
 (func $~lib/rt/itcms/step (result i32)
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  block $break|0
   block $case2|0
    block $case1|0
     block $case0|0
      global.get $~lib/rt/itcms/state
      br_table $case0|0 $case1|0 $case2|0 $break|0
     end
     i32.const 1
     global.set $~lib/rt/itcms/state
     i32.const 0
     global.set $~lib/rt/itcms/visitCount
     call $~lib/rt/itcms/visitRoots
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/iter
     global.get $~lib/rt/itcms/visitCount
     return
    end
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.set $1
    global.get $~lib/rt/itcms/iter
    i32.load $0 offset=4
    i32.const -4
    i32.and
    local.set $0
    loop $while-continue|1
     local.get $0
     global.get $~lib/rt/itcms/toSpace
     i32.ne
     if
      local.get $0
      global.set $~lib/rt/itcms/iter
      local.get $1
      local.get $0
      i32.load $0 offset=4
      i32.const 3
      i32.and
      i32.ne
      if
       local.get $0
       local.get $0
       i32.load $0 offset=4
       i32.const -4
       i32.and
       local.get $1
       i32.or
       i32.store $0 offset=4
       i32.const 0
       global.set $~lib/rt/itcms/visitCount
       local.get $0
       i32.const 20
       i32.add
       call $~lib/rt/__visit_members
       global.get $~lib/rt/itcms/visitCount
       return
      end
      local.get $0
      i32.load $0 offset=4
      i32.const -4
      i32.and
      local.set $0
      br $while-continue|1
     end
    end
    i32.const 0
    global.set $~lib/rt/itcms/visitCount
    call $~lib/rt/itcms/visitRoots
    global.get $~lib/rt/itcms/toSpace
    global.get $~lib/rt/itcms/iter
    i32.load $0 offset=4
    i32.const -4
    i32.and
    i32.eq
    if
     global.get $~lib/memory/__stack_pointer
     local.set $0
     loop $while-continue|0
      local.get $0
      i32.const 34588
      i32.lt_u
      if
       local.get $0
       i32.load $0
       local.tee $2
       if
        local.get $2
        call $byn-split-outlined-A$~lib/rt/itcms/__visit
       end
       local.get $0
       i32.const 4
       i32.add
       local.set $0
       br $while-continue|0
      end
     end
     global.get $~lib/rt/itcms/iter
     i32.load $0 offset=4
     i32.const -4
     i32.and
     local.set $0
     loop $while-continue|2
      local.get $0
      global.get $~lib/rt/itcms/toSpace
      i32.ne
      if
       local.get $1
       local.get $0
       i32.load $0 offset=4
       i32.const 3
       i32.and
       i32.ne
       if
        local.get $0
        local.get $0
        i32.load $0 offset=4
        i32.const -4
        i32.and
        local.get $1
        i32.or
        i32.store $0 offset=4
        local.get $0
        i32.const 20
        i32.add
        call $~lib/rt/__visit_members
       end
       local.get $0
       i32.load $0 offset=4
       i32.const -4
       i32.and
       local.set $0
       br $while-continue|2
      end
     end
     global.get $~lib/rt/itcms/fromSpace
     local.set $0
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/fromSpace
     local.get $0
     global.set $~lib/rt/itcms/toSpace
     local.get $1
     global.set $~lib/rt/itcms/white
     local.get $0
     i32.load $0 offset=4
     i32.const -4
     i32.and
     global.set $~lib/rt/itcms/iter
     i32.const 2
     global.set $~lib/rt/itcms/state
    end
    global.get $~lib/rt/itcms/visitCount
    return
   end
   global.get $~lib/rt/itcms/iter
   local.tee $0
   global.get $~lib/rt/itcms/toSpace
   i32.ne
   if
    local.get $0
    i32.load $0 offset=4
    local.tee $1
    i32.const -4
    i32.and
    global.set $~lib/rt/itcms/iter
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.get $1
    i32.const 3
    i32.and
    i32.ne
    if
     i32.const 0
     i32.const 1232
     i32.const 229
     i32.const 20
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    i32.const 34588
    i32.lt_u
    if
     local.get $0
     i32.const 0
     i32.store $0 offset=4
     local.get $0
     i32.const 0
     i32.store $0 offset=8
    else
     global.get $~lib/rt/itcms/total
     local.get $0
     i32.load $0
     i32.const -4
     i32.and
     i32.const 4
     i32.add
     i32.sub
     global.set $~lib/rt/itcms/total
     local.get $0
     i32.const 4
     i32.add
     local.tee $0
     i32.const 34588
     i32.ge_u
     if
      global.get $~lib/rt/tlsf/ROOT
      i32.eqz
      if
       call $~lib/rt/tlsf/initialize
      end
      global.get $~lib/rt/tlsf/ROOT
      local.set $1
      local.get $0
      i32.const 4
      i32.sub
      local.set $2
      local.get $0
      i32.const 15
      i32.and
      i32.const 1
      local.get $0
      select
      if (result i32)
       i32.const 1
      else
       local.get $2
       i32.load $0
       i32.const 1
       i32.and
      end
      if
       i32.const 0
       i32.const 1504
       i32.const 562
       i32.const 3
       call $~lib/builtins/abort
       unreachable
      end
      local.get $2
      local.get $2
      i32.load $0
      i32.const 1
      i32.or
      i32.store $0
      local.get $1
      local.get $2
      call $~lib/rt/tlsf/insertBlock
     end
    end
    i32.const 10
    return
   end
   global.get $~lib/rt/itcms/toSpace
   local.tee $0
   local.get $0
   i32.store $0 offset=4
   local.get $0
   local.get $0
   i32.store $0 offset=8
   i32.const 0
   global.set $~lib/rt/itcms/state
  end
  i32.const 0
 )
 (func $~lib/rt/tlsf/searchBlock (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $1
  i32.const 256
  i32.lt_u
  if (result i32)
   local.get $1
   i32.const 4
   i32.shr_u
  else
   i32.const 31
   local.get $1
   i32.const 1
   i32.const 27
   local.get $1
   i32.clz
   i32.sub
   i32.shl
   i32.add
   i32.const 1
   i32.sub
   local.get $1
   local.get $1
   i32.const 536870910
   i32.lt_u
   select
   local.tee $1
   i32.clz
   i32.sub
   local.tee $3
   i32.const 7
   i32.sub
   local.set $2
   local.get $1
   local.get $3
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 16
   i32.xor
  end
  local.tee $1
  i32.const 16
  i32.lt_u
  local.get $2
  i32.const 23
  i32.lt_u
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 1504
   i32.const 334
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  i32.load $0 offset=4
  i32.const -1
  local.get $1
  i32.shl
  i32.and
  local.tee $1
  if (result i32)
   local.get $0
   local.get $1
   i32.ctz
   local.get $2
   i32.const 4
   i32.shl
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load $0 offset=96
  else
   local.get $0
   i32.load $0
   i32.const -1
   local.get $2
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.tee $1
   if (result i32)
    local.get $0
    local.get $1
    i32.ctz
    local.tee $1
    i32.const 2
    i32.shl
    i32.add
    i32.load $0 offset=4
    local.tee $2
    i32.eqz
    if
     i32.const 0
     i32.const 1504
     i32.const 347
     i32.const 18
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    local.get $2
    i32.ctz
    local.get $1
    i32.const 4
    i32.shl
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load $0 offset=96
   else
    i32.const 0
   end
  end
 )
 (func $~lib/rt/itcms/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741804
  i32.ge_u
  if
   i32.const 1168
   i32.const 1232
   i32.const 261
   i32.const 31
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/total
  global.get $~lib/rt/itcms/threshold
  i32.ge_u
  if
   block $__inlined_func$~lib/rt/itcms/interrupt
    i32.const 2048
    local.set $2
    loop $do-loop|0
     local.get $2
     call $~lib/rt/itcms/step
     i32.sub
     local.set $2
     global.get $~lib/rt/itcms/state
     i32.eqz
     if
      global.get $~lib/rt/itcms/total
      i64.extend_i32_u
      i64.const 200
      i64.mul
      i64.const 100
      i64.div_u
      i32.wrap_i64
      i32.const 1024
      i32.add
      global.set $~lib/rt/itcms/threshold
      br $__inlined_func$~lib/rt/itcms/interrupt
     end
     local.get $2
     i32.const 0
     i32.gt_s
     br_if $do-loop|0
    end
    global.get $~lib/rt/itcms/total
    local.tee $2
    local.get $2
    global.get $~lib/rt/itcms/threshold
    i32.sub
    i32.const 1024
    i32.lt_u
    i32.const 10
    i32.shl
    i32.add
    global.set $~lib/rt/itcms/threshold
   end
  end
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.set $4
  local.get $0
  i32.const 16
  i32.add
  local.tee $2
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1168
   i32.const 1504
   i32.const 461
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  i32.const 12
  local.get $2
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.get $2
  i32.const 12
  i32.le_u
  select
  local.tee $5
  call $~lib/rt/tlsf/searchBlock
  local.tee $2
  i32.eqz
  if
   memory.size $0
   local.tee $2
   local.get $5
   i32.const 256
   i32.ge_u
   if (result i32)
    local.get $5
    i32.const 1
    i32.const 27
    local.get $5
    i32.clz
    i32.sub
    i32.shl
    i32.add
    i32.const 1
    i32.sub
    local.get $5
    local.get $5
    i32.const 536870910
    i32.lt_u
    select
   else
    local.get $5
   end
   i32.const 4
   local.get $4
   i32.load $0 offset=1568
   local.get $2
   i32.const 16
   i32.shl
   i32.const 4
   i32.sub
   i32.ne
   i32.shl
   i32.add
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.get $2
   local.get $3
   i32.gt_s
   select
   memory.grow $0
   i32.const 0
   i32.lt_s
   if
    local.get $3
    memory.grow $0
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
   local.get $4
   local.get $2
   i32.const 16
   i32.shl
   memory.size $0
   i64.extend_i32_s
   i64.const 16
   i64.shl
   call $~lib/rt/tlsf/addMemory
   local.get $4
   local.get $5
   call $~lib/rt/tlsf/searchBlock
   local.tee $2
   i32.eqz
   if
    i32.const 0
    i32.const 1504
    i32.const 499
    i32.const 16
    call $~lib/builtins/abort
    unreachable
   end
  end
  local.get $5
  local.get $2
  i32.load $0
  i32.const -4
  i32.and
  i32.gt_u
  if
   i32.const 0
   i32.const 1504
   i32.const 501
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $4
  local.get $2
  call $~lib/rt/tlsf/removeBlock
  local.get $2
  i32.load $0
  local.set $3
  local.get $5
  i32.const 4
  i32.add
  i32.const 15
  i32.and
  if
   i32.const 0
   i32.const 1504
   i32.const 361
   i32.const 14
   call $~lib/builtins/abort
   unreachable
  end
  local.get $3
  i32.const -4
  i32.and
  local.get $5
  i32.sub
  local.tee $6
  i32.const 16
  i32.ge_u
  if
   local.get $2
   local.get $5
   local.get $3
   i32.const 2
   i32.and
   i32.or
   i32.store $0
   local.get $2
   i32.const 4
   i32.add
   local.get $5
   i32.add
   local.tee $3
   local.get $6
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   i32.store $0
   local.get $4
   local.get $3
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $2
   local.get $3
   i32.const -2
   i32.and
   i32.store $0
   local.get $2
   i32.const 4
   i32.add
   local.get $2
   i32.load $0
   i32.const -4
   i32.and
   i32.add
   local.tee $3
   local.get $3
   i32.load $0
   i32.const -3
   i32.and
   i32.store $0
  end
  local.get $2
  local.get $1
  i32.store $0 offset=12
  local.get $2
  local.get $0
  i32.store $0 offset=16
  global.get $~lib/rt/itcms/fromSpace
  local.tee $1
  i32.load $0 offset=8
  local.set $3
  local.get $2
  local.get $1
  global.get $~lib/rt/itcms/white
  i32.or
  i32.store $0 offset=4
  local.get $2
  local.get $3
  i32.store $0 offset=8
  local.get $3
  local.get $2
  local.get $3
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.or
  i32.store $0 offset=4
  local.get $1
  local.get $2
  i32.store $0 offset=8
  global.get $~lib/rt/itcms/total
  local.get $2
  i32.load $0
  i32.const -4
  i32.and
  i32.const 4
  i32.add
  i32.add
  global.set $~lib/rt/itcms/total
  local.get $2
  i32.const 20
  i32.add
  local.tee $1
  i32.const 0
  local.get $0
  memory.fill $0
  local.get $1
 )
 (func $~lib/arraybuffer/ArrayBufferView#set:buffer (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  i32.store $0
  local.get $1
  if
   local.get $0
   i32.eqz
   if
    i32.const 0
    i32.const 1232
    i32.const 295
    i32.const 14
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/rt/itcms/white
   local.get $1
   i32.const 20
   i32.sub
   local.tee $1
   i32.load $0 offset=4
   i32.const 3
   i32.and
   i32.eq
   if
    local.get $0
    i32.const 20
    i32.sub
    i32.load $0 offset=4
    i32.const 3
    i32.and
    local.tee $0
    global.get $~lib/rt/itcms/white
    i32.eqz
    i32.eq
    if
     local.get $1
     call $~lib/rt/itcms/Object#makeGray
    else
     global.get $~lib/rt/itcms/state
     i32.const 1
     i32.eq
     local.get $0
     i32.const 3
     i32.eq
     i32.and
     if
      local.get $1
      call $~lib/rt/itcms/Object#makeGray
     end
    end
   end
  end
 )
 (func $~lib/math/NativeMathf.atan (param $0 f32) (result f32)
  (local $1 f32)
  (local $2 i32)
  (local $3 i32)
  (local $4 f32)
  (local $5 f32)
  local.get $0
  local.set $1
  local.get $0
  i32.reinterpret_f32
  i32.const 2147483647
  i32.and
  local.tee $2
  i32.const 1283457024
  i32.ge_u
  if
   local.get $0
   local.get $0
   f32.ne
   if
    local.get $0
    return
   end
   f32.const 1.570796251296997
   local.get $1
   f32.copysign
   return
  end
  local.get $2
  i32.const 1054867456
  i32.lt_u
  if
   local.get $2
   i32.const 964689920
   i32.lt_u
   if
    local.get $0
    return
   end
   i32.const -1
   local.set $3
  else
   local.get $0
   f32.abs
   local.set $0
   local.get $2
   i32.const 1066926080
   i32.lt_u
   if (result f32)
    local.get $2
    i32.const 1060110336
    i32.lt_u
    if (result f32)
     local.get $0
     local.get $0
     f32.add
     f32.const -1
     f32.add
     local.get $0
     f32.const 2
     f32.add
     f32.div
    else
     i32.const 1
     local.set $3
     local.get $0
     f32.const -1
     f32.add
     local.get $0
     f32.const 1
     f32.add
     f32.div
    end
   else
    local.get $2
    i32.const 1075576832
    i32.lt_u
    if (result f32)
     i32.const 2
     local.set $3
     local.get $0
     f32.const -1.5
     f32.add
     local.get $0
     f32.const 1.5
     f32.mul
     f32.const 1
     f32.add
     f32.div
    else
     i32.const 3
     local.set $3
     f32.const -1
     local.get $0
     f32.div
    end
   end
   local.set $0
  end
  local.get $0
  local.get $0
  f32.mul
  local.tee $5
  local.get $5
  f32.mul
  local.set $4
  local.get $0
  local.get $5
  local.get $4
  local.get $4
  f32.const 0.06168760731816292
  f32.mul
  f32.const 0.14253635704517365
  f32.add
  f32.mul
  f32.const 0.333333283662796
  f32.add
  f32.mul
  local.get $4
  local.get $4
  f32.const -0.106480173766613
  f32.mul
  f32.const -0.19999158382415771
  f32.add
  f32.mul
  f32.add
  f32.mul
  local.set $4
  local.get $3
  i32.const 0
  i32.lt_s
  if
   local.get $0
   local.get $4
   f32.sub
   return
  end
  block $break|0
   block $case4|0
    block $case3|0
     block $case2|0
      block $case1|0
       block $case0|0
        local.get $3
        br_table $case0|0 $case1|0 $case2|0 $case3|0 $case4|0
       end
       f32.const 0.46364760398864746
       local.get $4
       f32.const -5.01215824399992e-09
       f32.add
       local.get $0
       f32.sub
       f32.sub
       local.set $0
       br $break|0
      end
      f32.const 0.7853981256484985
      local.get $4
      f32.const -3.774894707930798e-08
      f32.add
      local.get $0
      f32.sub
      f32.sub
      local.set $0
      br $break|0
     end
     f32.const 0.9827936887741089
     local.get $4
     f32.const -3.447321716976148e-08
     f32.add
     local.get $0
     f32.sub
     f32.sub
     local.set $0
     br $break|0
    end
    f32.const 1.570796251296997
    local.get $4
    f32.const -7.549789415861596e-08
    f32.add
    local.get $0
    f32.sub
    f32.sub
    local.set $0
    br $break|0
   end
   unreachable
  end
  local.get $0
  local.get $1
  f32.copysign
 )
 (func $~lib/math/NativeMathf.atan2 (param $0 f32) (param $1 f32) (result f32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  local.get $0
  f32.ne
  local.get $1
  local.get $1
  f32.ne
  i32.or
  if
   local.get $1
   local.get $0
   f32.add
   return
  end
  local.get $1
  i32.reinterpret_f32
  local.tee $3
  i32.const 1065353216
  i32.eq
  if
   local.get $0
   call $~lib/math/NativeMathf.atan
   return
  end
  local.get $3
  i32.const 30
  i32.shr_u
  i32.const 2
  i32.and
  local.get $0
  i32.reinterpret_f32
  local.tee $4
  i32.const 31
  i32.shr_u
  i32.or
  local.set $2
  local.get $4
  i32.const 2147483647
  i32.and
  local.tee $4
  i32.eqz
  if
   block $break|0
    block $case3|0
     block $case2|0
      block $case1|0
       local.get $2
       br_table $case1|0 $case1|0 $case2|0 $case3|0 $break|0
      end
      local.get $0
      return
     end
     f32.const 3.1415927410125732
     return
    end
    f32.const -3.1415927410125732
    return
   end
  end
  block $folding-inner0
   local.get $3
   i32.const 2147483647
   i32.and
   local.tee $3
   i32.eqz
   br_if $folding-inner0
   local.get $3
   i32.const 2139095040
   i32.eq
   if
    local.get $4
    i32.const 2139095040
    i32.eq
    if (result f32)
     f32.const 2.356194496154785
     f32.const 0.7853981852531433
     local.get $2
     i32.const 2
     i32.and
     select
     local.tee $0
     f32.neg
     local.get $0
     local.get $2
     i32.const 1
     i32.and
     select
    else
     f32.const 3.1415927410125732
     f32.const 0
     local.get $2
     i32.const 2
     i32.and
     select
     local.tee $0
     f32.neg
     local.get $0
     local.get $2
     i32.const 1
     i32.and
     select
    end
    return
   end
   local.get $4
   i32.const 2139095040
   i32.eq
   local.get $3
   i32.const 218103808
   i32.add
   local.get $4
   i32.lt_u
   i32.or
   br_if $folding-inner0
   local.get $4
   i32.const 218103808
   i32.add
   local.get $3
   i32.lt_u
   i32.const 0
   local.get $2
   i32.const 2
   i32.and
   select
   if (result f32)
    f32.const 0
   else
    local.get $0
    local.get $1
    f32.div
    f32.abs
    call $~lib/math/NativeMathf.atan
   end
   local.set $0
   block $break|1
    block $case3|1
     block $case2|1
      block $case1|1
       block $case0|1
        local.get $2
        br_table $case0|1 $case1|1 $case2|1 $case3|1 $break|1
       end
       local.get $0
       return
      end
      local.get $0
      f32.neg
      return
     end
     f32.const 3.1415927410125732
     local.get $0
     f32.const 8.742277657347586e-08
     f32.add
     f32.sub
     return
    end
    local.get $0
    f32.const 8.742277657347586e-08
    f32.add
    f32.const -3.1415927410125732
    f32.add
    return
   end
   unreachable
  end
  f32.const -1.5707963705062866
  f32.const 1.5707963705062866
  local.get $2
  i32.const 1
  i32.and
  select
 )
 (func $~lib/math/NativeMathf.cos (param $0 f32) (result f32)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 i64)
  (local $5 i32)
  (local $6 f64)
  (local $7 i32)
  (local $8 i64)
  (local $9 i64)
  local.get $0
  i32.reinterpret_f32
  local.tee $3
  i32.const 31
  i32.shr_u
  local.set $5
  block $folding-inner0
   local.get $3
   i32.const 2147483647
   i32.and
   local.tee $3
   i32.const 1061752794
   i32.le_u
   if
    local.get $3
    i32.const 964689920
    i32.lt_u
    if
     f32.const 1
     return
    end
    local.get $0
    f64.promote_f32
    local.tee $1
    local.get $1
    f64.mul
    local.tee $1
    local.get $1
    f64.mul
    local.set $2
    br $folding-inner0
   end
   local.get $3
   i32.const 1081824209
   i32.le_u
   if
    local.get $3
    i32.const 1075235811
    i32.gt_u
    if
     local.get $0
     f64.promote_f32
     local.tee $1
     f64.const 3.141592653589793
     f64.add
     local.get $1
     f64.const -3.141592653589793
     f64.add
     local.get $5
     select
     local.tee $1
     local.get $1
     f64.mul
     local.tee $1
     local.get $1
     f64.mul
     local.set $2
     local.get $1
     f64.const -0.499999997251031
     f64.mul
     f64.const 1
     f64.add
     local.get $2
     f64.const 0.04166662332373906
     f64.mul
     f64.add
     local.get $2
     local.get $1
     f64.mul
     local.get $1
     f64.const 2.439044879627741e-05
     f64.mul
     f64.const -0.001388676377460993
     f64.add
     f64.mul
     f64.add
     f32.demote_f64
     f32.neg
     return
    else
     local.get $5
     if (result f64)
      local.get $0
      f64.promote_f32
      f64.const 1.5707963267948966
      f64.add
      local.tee $2
      local.get $2
      f64.mul
      local.tee $1
      local.get $2
      f64.mul
     else
      f64.const 1.5707963267948966
      local.get $0
      f64.promote_f32
      f64.sub
      local.tee $2
      local.get $2
      f64.mul
      local.tee $1
      local.get $2
      f64.mul
     end
     local.set $6
     local.get $2
     local.get $6
     local.get $1
     f64.const 0.008333329385889463
     f64.mul
     f64.const -0.16666666641626524
     f64.add
     f64.mul
     f64.add
     local.get $6
     local.get $1
     local.get $1
     f64.mul
     f64.mul
     local.get $1
     f64.const 2.718311493989822e-06
     f64.mul
     f64.const -1.9839334836096632e-04
     f64.add
     f64.mul
     f64.add
     f32.demote_f64
     return
    end
    unreachable
   end
   local.get $3
   i32.const 1088565717
   i32.le_u
   if
    local.get $3
    i32.const 1085271519
    i32.gt_u
    if
     local.get $0
     f64.promote_f32
     local.tee $1
     f64.const 6.283185307179586
     f64.add
     local.get $1
     f64.const -6.283185307179586
     f64.add
     local.get $5
     select
     local.tee $1
     local.get $1
     f64.mul
     local.tee $1
     local.get $1
     f64.mul
     local.set $2
     br $folding-inner0
    else
     local.get $5
     if (result f64)
      local.get $0
      f32.neg
      f64.promote_f32
      f64.const -4.71238898038469
      f64.add
      local.tee $2
      local.get $2
      f64.mul
      local.tee $1
      local.get $2
      f64.mul
     else
      local.get $0
      f64.promote_f32
      f64.const -4.71238898038469
      f64.add
      local.tee $2
      local.get $2
      f64.mul
      local.tee $1
      local.get $2
      f64.mul
     end
     local.set $6
     local.get $2
     local.get $6
     local.get $1
     f64.const 0.008333329385889463
     f64.mul
     f64.const -0.16666666641626524
     f64.add
     f64.mul
     f64.add
     local.get $6
     local.get $1
     local.get $1
     f64.mul
     f64.mul
     local.get $1
     f64.const 2.718311493989822e-06
     f64.mul
     f64.const -1.9839334836096632e-04
     f64.add
     f64.mul
     f64.add
     f32.demote_f64
     return
    end
    unreachable
   end
   local.get $3
   i32.const 2139095040
   i32.ge_u
   if
    local.get $0
    local.get $0
    f32.sub
    return
   end
   block $~lib/math/rempio2f|inlined.0 (result i32)
    local.get $3
    i32.const 1305022427
    i32.lt_u
    if
     local.get $0
     f64.promote_f32
     local.tee $1
     f64.const 0.6366197723675814
     f64.mul
     f64.nearest
     local.set $2
     local.get $1
     local.get $2
     f64.const 1.5707963109016418
     f64.mul
     f64.sub
     local.get $2
     f64.const 1.5893254773528196e-08
     f64.mul
     f64.sub
     global.set $~lib/math/rempio2f_y
     local.get $2
     i32.trunc_sat_f64_s
     br $~lib/math/rempio2f|inlined.0
    end
    local.get $3
    i32.const 23
    i32.shr_s
    i32.const 152
    i32.sub
    local.tee $7
    i32.const 63
    i32.and
    i64.extend_i32_s
    local.set $8
    local.get $7
    i32.const 6
    i32.shr_s
    i32.const 3
    i32.shl
    i32.const 1616
    i32.add
    local.tee $7
    i64.load $0 offset=8
    local.set $4
    f64.const 8.515303950216386e-20
    local.get $0
    f64.promote_f32
    f64.copysign
    local.get $3
    i32.const 8388607
    i32.and
    i32.const 8388608
    i32.or
    i64.extend_i32_s
    local.tee $9
    local.get $7
    i64.load $0
    local.get $8
    i64.shl
    local.get $4
    i64.const 64
    local.get $8
    i64.sub
    i64.shr_u
    i64.or
    i64.mul
    local.get $8
    i64.const 32
    i64.gt_u
    if (result i64)
     local.get $4
     local.get $8
     i64.const 32
     i64.sub
     i64.shl
     local.get $7
     i64.load $0 offset=16
     i64.const 96
     local.get $8
     i64.sub
     i64.shr_u
     i64.or
    else
     local.get $4
     i64.const 32
     local.get $8
     i64.sub
     i64.shr_u
    end
    local.get $9
    i64.mul
    i64.const 32
    i64.shr_u
    i64.add
    local.tee $4
    i64.const 2
    i64.shl
    local.tee $8
    f64.convert_i64_s
    f64.mul
    global.set $~lib/math/rempio2f_y
    i32.const 0
    local.get $4
    i64.const 62
    i64.shr_u
    local.get $8
    i64.const 63
    i64.shr_u
    i64.add
    i32.wrap_i64
    local.tee $3
    i32.sub
    local.get $3
    local.get $5
    select
   end
   local.set $3
   global.get $~lib/math/rempio2f_y
   local.set $1
   local.get $3
   i32.const 1
   i32.and
   if (result f32)
    local.get $1
    local.get $1
    local.get $1
    f64.mul
    local.tee $2
    local.get $1
    f64.mul
    local.tee $1
    local.get $2
    f64.const 0.008333329385889463
    f64.mul
    f64.const -0.16666666641626524
    f64.add
    f64.mul
    f64.add
    local.get $1
    local.get $2
    local.get $2
    f64.mul
    f64.mul
    local.get $2
    f64.const 2.718311493989822e-06
    f64.mul
    f64.const -1.9839334836096632e-04
    f64.add
    f64.mul
    f64.add
    f32.demote_f64
   else
    local.get $1
    local.get $1
    f64.mul
    local.tee $1
    local.get $1
    f64.mul
    local.set $2
    local.get $1
    f64.const -0.499999997251031
    f64.mul
    f64.const 1
    f64.add
    local.get $2
    f64.const 0.04166662332373906
    f64.mul
    f64.add
    local.get $2
    local.get $1
    f64.mul
    local.get $1
    f64.const 2.439044879627741e-05
    f64.mul
    f64.const -0.001388676377460993
    f64.add
    f64.mul
    f64.add
    f32.demote_f64
   end
   local.tee $0
   f32.neg
   local.get $0
   local.get $3
   i32.const 1
   i32.add
   i32.const 2
   i32.and
   select
   return
  end
  local.get $1
  f64.const -0.499999997251031
  f64.mul
  f64.const 1
  f64.add
  local.get $2
  f64.const 0.04166662332373906
  f64.mul
  f64.add
  local.get $2
  local.get $1
  f64.mul
  local.get $1
  f64.const 2.439044879627741e-05
  f64.mul
  f64.const -0.001388676377460993
  f64.add
  f64.mul
  f64.add
  f32.demote_f64
 )
 (func $~lib/math/NativeMathf.sin (param $0 f32) (result f32)
  (local $1 f64)
  (local $2 f64)
  (local $3 i32)
  (local $4 f64)
  (local $5 i64)
  (local $6 i32)
  (local $7 i32)
  (local $8 i64)
  (local $9 i64)
  local.get $0
  i32.reinterpret_f32
  local.tee $3
  i32.const 31
  i32.shr_u
  local.set $6
  block $folding-inner0
   local.get $3
   i32.const 2147483647
   i32.and
   local.tee $3
   i32.const 1061752794
   i32.le_u
   if
    local.get $3
    i32.const 964689920
    i32.lt_u
    if
     local.get $0
     return
    end
    local.get $0
    f64.promote_f32
    local.tee $2
    local.get $2
    f64.mul
    local.tee $1
    local.get $2
    f64.mul
    local.set $4
    br $folding-inner0
   end
   local.get $3
   i32.const 1081824209
   i32.le_u
   if
    local.get $3
    i32.const 1075235811
    i32.le_u
    if
     local.get $6
     if (result f32)
      local.get $0
      f64.promote_f32
      f64.const 1.5707963267948966
      f64.add
      local.tee $1
      local.get $1
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $2
      local.get $1
      f64.const -0.499999997251031
      f64.mul
      f64.const 1
      f64.add
      local.get $2
      f64.const 0.04166662332373906
      f64.mul
      f64.add
      local.get $2
      local.get $1
      f64.mul
      local.get $1
      f64.const 2.439044879627741e-05
      f64.mul
      f64.const -0.001388676377460993
      f64.add
      f64.mul
      f64.add
      f32.demote_f64
      f32.neg
     else
      local.get $0
      f64.promote_f32
      f64.const -1.5707963267948966
      f64.add
      local.tee $1
      local.get $1
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $2
      local.get $1
      f64.const -0.499999997251031
      f64.mul
      f64.const 1
      f64.add
      local.get $2
      f64.const 0.04166662332373906
      f64.mul
      f64.add
      local.get $2
      local.get $1
      f64.mul
      local.get $1
      f64.const 2.439044879627741e-05
      f64.mul
      f64.const -0.001388676377460993
      f64.add
      f64.mul
      f64.add
      f32.demote_f64
     end
     return
    end
    local.get $0
    f64.promote_f32
    local.tee $1
    f64.const 3.141592653589793
    f64.add
    local.get $1
    f64.const -3.141592653589793
    f64.add
    local.get $6
    select
    f64.neg
    local.tee $2
    local.get $2
    f64.mul
    local.tee $1
    local.get $2
    f64.mul
    local.set $4
    br $folding-inner0
   end
   local.get $3
   i32.const 1088565717
   i32.le_u
   if
    local.get $3
    i32.const 1085271519
    i32.le_u
    if
     local.get $6
     if (result f32)
      local.get $0
      f64.promote_f32
      f64.const 4.71238898038469
      f64.add
      local.tee $1
      local.get $1
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $2
      local.get $1
      f64.const -0.499999997251031
      f64.mul
      f64.const 1
      f64.add
      local.get $2
      f64.const 0.04166662332373906
      f64.mul
      f64.add
      local.get $2
      local.get $1
      f64.mul
      local.get $1
      f64.const 2.439044879627741e-05
      f64.mul
      f64.const -0.001388676377460993
      f64.add
      f64.mul
      f64.add
      f32.demote_f64
     else
      local.get $0
      f64.promote_f32
      f64.const -4.71238898038469
      f64.add
      local.tee $1
      local.get $1
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $2
      local.get $1
      f64.const -0.499999997251031
      f64.mul
      f64.const 1
      f64.add
      local.get $2
      f64.const 0.04166662332373906
      f64.mul
      f64.add
      local.get $2
      local.get $1
      f64.mul
      local.get $1
      f64.const 2.439044879627741e-05
      f64.mul
      f64.const -0.001388676377460993
      f64.add
      f64.mul
      f64.add
      f32.demote_f64
      f32.neg
     end
     return
    end
    local.get $0
    f64.promote_f32
    local.tee $1
    f64.const 6.283185307179586
    f64.add
    local.get $1
    f64.const -6.283185307179586
    f64.add
    local.get $6
    select
    local.tee $2
    local.get $2
    f64.mul
    local.tee $1
    local.get $2
    f64.mul
    local.set $4
    br $folding-inner0
   end
   local.get $3
   i32.const 2139095040
   i32.ge_u
   if
    local.get $0
    local.get $0
    f32.sub
    return
   end
   block $~lib/math/rempio2f|inlined.1 (result i32)
    local.get $3
    i32.const 1305022427
    i32.lt_u
    if
     local.get $0
     f64.promote_f32
     local.tee $1
     f64.const 0.6366197723675814
     f64.mul
     f64.nearest
     local.set $2
     local.get $1
     local.get $2
     f64.const 1.5707963109016418
     f64.mul
     f64.sub
     local.get $2
     f64.const 1.5893254773528196e-08
     f64.mul
     f64.sub
     global.set $~lib/math/rempio2f_y
     local.get $2
     i32.trunc_sat_f64_s
     br $~lib/math/rempio2f|inlined.1
    end
    local.get $3
    i32.const 23
    i32.shr_s
    i32.const 152
    i32.sub
    local.tee $7
    i32.const 63
    i32.and
    i64.extend_i32_s
    local.set $8
    local.get $7
    i32.const 6
    i32.shr_s
    i32.const 3
    i32.shl
    i32.const 1616
    i32.add
    local.tee $7
    i64.load $0 offset=8
    local.set $5
    f64.const 8.515303950216386e-20
    local.get $0
    f64.promote_f32
    f64.copysign
    local.get $3
    i32.const 8388607
    i32.and
    i32.const 8388608
    i32.or
    i64.extend_i32_s
    local.tee $9
    local.get $7
    i64.load $0
    local.get $8
    i64.shl
    local.get $5
    i64.const 64
    local.get $8
    i64.sub
    i64.shr_u
    i64.or
    i64.mul
    local.get $8
    i64.const 32
    i64.gt_u
    if (result i64)
     local.get $5
     local.get $8
     i64.const 32
     i64.sub
     i64.shl
     local.get $7
     i64.load $0 offset=16
     i64.const 96
     local.get $8
     i64.sub
     i64.shr_u
     i64.or
    else
     local.get $5
     i64.const 32
     local.get $8
     i64.sub
     i64.shr_u
    end
    local.get $9
    i64.mul
    i64.const 32
    i64.shr_u
    i64.add
    local.tee $5
    i64.const 2
    i64.shl
    local.tee $8
    f64.convert_i64_s
    f64.mul
    global.set $~lib/math/rempio2f_y
    i32.const 0
    local.get $5
    i64.const 62
    i64.shr_u
    local.get $8
    i64.const 63
    i64.shr_u
    i64.add
    i32.wrap_i64
    local.tee $3
    i32.sub
    local.get $3
    local.get $6
    select
   end
   local.set $3
   global.get $~lib/math/rempio2f_y
   local.set $1
   local.get $3
   i32.const 1
   i32.and
   if (result f32)
    local.get $1
    local.get $1
    f64.mul
    local.tee $1
    local.get $1
    f64.mul
    local.set $2
    local.get $1
    f64.const -0.499999997251031
    f64.mul
    f64.const 1
    f64.add
    local.get $2
    f64.const 0.04166662332373906
    f64.mul
    f64.add
    local.get $2
    local.get $1
    f64.mul
    local.get $1
    f64.const 2.439044879627741e-05
    f64.mul
    f64.const -0.001388676377460993
    f64.add
    f64.mul
    f64.add
    f32.demote_f64
   else
    local.get $1
    local.get $1
    local.get $1
    f64.mul
    local.tee $2
    local.get $1
    f64.mul
    local.tee $1
    local.get $2
    f64.const 0.008333329385889463
    f64.mul
    f64.const -0.16666666641626524
    f64.add
    f64.mul
    f64.add
    local.get $1
    local.get $2
    local.get $2
    f64.mul
    f64.mul
    local.get $2
    f64.const 2.718311493989822e-06
    f64.mul
    f64.const -1.9839334836096632e-04
    f64.add
    f64.mul
    f64.add
    f32.demote_f64
   end
   local.tee $0
   f32.neg
   local.get $0
   local.get $3
   i32.const 2
   i32.and
   select
   return
  end
  local.get $2
  local.get $4
  local.get $1
  f64.const 0.008333329385889463
  f64.mul
  f64.const -0.16666666641626524
  f64.add
  f64.mul
  f64.add
  local.get $4
  local.get $1
  local.get $1
  f64.mul
  f64.mul
  local.get $1
  f64.const 2.718311493989822e-06
  f64.mul
  f64.const -1.9839334836096632e-04
  f64.add
  f64.mul
  f64.add
  f32.demote_f64
 )
 (func $~lib/math/NativeMathf.asin (param $0 f32) (result f32)
  (local $1 i32)
  (local $2 f64)
  (local $3 f32)
  local.get $0
  i32.reinterpret_f32
  i32.const 2147483647
  i32.and
  local.tee $1
  i32.const 1065353216
  i32.ge_u
  if
   local.get $1
   i32.const 1065353216
   i32.eq
   if
    local.get $0
    f32.const 1.5707963705062866
    f32.mul
    f32.const 7.52316384526264e-37
    f32.add
    return
   end
   f32.const 0
   local.get $0
   local.get $0
   f32.sub
   f32.div
   return
  end
  local.get $1
  i32.const 1056964608
  i32.lt_u
  if
   local.get $1
   i32.const 964689920
   i32.lt_u
   local.get $1
   i32.const 8388608
   i32.ge_u
   i32.and
   if
    local.get $0
    return
   end
   local.get $0
   local.get $0
   local.get $0
   local.get $0
   f32.mul
   local.tee $0
   local.get $0
   local.get $0
   f32.const -0.008656363002955914
   f32.mul
   f32.const -0.04274342209100723
   f32.add
   f32.mul
   f32.const 0.16666586697101593
   f32.add
   f32.mul
   local.get $0
   f32.const -0.7066296339035034
   f32.mul
   f32.const 1
   f32.add
   f32.div
   f32.mul
   f32.add
   return
  end
  f64.const 1.5707963705062866
  f32.const 0.5
  local.get $0
  f32.abs
  f32.const 0.5
  f32.mul
  f32.sub
  local.tee $3
  f64.promote_f32
  f64.sqrt
  local.tee $2
  local.get $2
  local.get $3
  local.get $3
  local.get $3
  f32.const -0.008656363002955914
  f32.mul
  f32.const -0.04274342209100723
  f32.add
  f32.mul
  f32.const 0.16666586697101593
  f32.add
  f32.mul
  local.get $3
  f32.const -0.7066296339035034
  f32.mul
  f32.const 1
  f32.add
  f32.div
  f64.promote_f32
  f64.mul
  f64.add
  f64.const 2
  f64.mul
  f64.sub
  f32.demote_f64
  local.get $0
  f32.copysign
 )
 (func $~lib/math/NativeMathf.tan (param $0 f32) (result f32)
  (local $1 f64)
  (local $2 f64)
  (local $3 f64)
  (local $4 i32)
  (local $5 i64)
  (local $6 i32)
  (local $7 i32)
  (local $8 i64)
  (local $9 i64)
  local.get $0
  i32.reinterpret_f32
  local.tee $4
  i32.const 31
  i32.shr_u
  local.set $6
  block $folding-inner1
   block $folding-inner0
    local.get $4
    i32.const 2147483647
    i32.and
    local.tee $4
    i32.const 1061752794
    i32.le_u
    if
     local.get $4
     i32.const 964689920
     i32.lt_u
     if
      local.get $0
      return
     end
     local.get $0
     f64.promote_f32
     local.tee $2
     local.get $2
     f64.mul
     local.tee $1
     local.get $1
     f64.mul
     local.set $3
     br $folding-inner0
    end
    local.get $4
    i32.const 1081824209
    i32.le_u
    if
     local.get $4
     i32.const 1075235811
     i32.le_u
     if
      local.get $0
      f64.promote_f32
      local.tee $1
      f64.const 1.5707963267948966
      f64.add
      local.get $1
      f64.const -1.5707963267948966
      f64.add
      local.get $6
      select
      local.tee $2
      local.get $2
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $3
      br $folding-inner1
     else
      local.get $0
      f64.promote_f32
      local.tee $1
      f64.const 3.141592653589793
      f64.add
      local.get $1
      f64.const -3.141592653589793
      f64.add
      local.get $6
      select
      local.tee $2
      local.get $2
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $3
      br $folding-inner0
     end
     unreachable
    end
    local.get $4
    i32.const 1088565717
    i32.le_u
    if
     local.get $4
     i32.const 1085271519
     i32.le_u
     if
      local.get $0
      f64.promote_f32
      local.tee $1
      f64.const 4.71238898038469
      f64.add
      local.get $1
      f64.const -4.71238898038469
      f64.add
      local.get $6
      select
      local.tee $2
      local.get $2
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $3
      br $folding-inner1
     else
      local.get $0
      f64.promote_f32
      local.tee $1
      f64.const 6.283185307179586
      f64.add
      local.get $1
      f64.const -6.283185307179586
      f64.add
      local.get $6
      select
      local.tee $2
      local.get $2
      f64.mul
      local.tee $1
      local.get $1
      f64.mul
      local.set $3
      br $folding-inner0
     end
     unreachable
    end
    local.get $4
    i32.const 2139095040
    i32.ge_u
    if
     local.get $0
     local.get $0
     f32.sub
     return
    end
    block $~lib/math/rempio2f|inlined.2 (result i32)
     local.get $4
     i32.const 1305022427
     i32.lt_u
     if
      local.get $0
      f64.promote_f32
      local.tee $1
      f64.const 0.6366197723675814
      f64.mul
      f64.nearest
      local.set $2
      local.get $1
      local.get $2
      f64.const 1.5707963109016418
      f64.mul
      f64.sub
      local.get $2
      f64.const 1.5893254773528196e-08
      f64.mul
      f64.sub
      global.set $~lib/math/rempio2f_y
      local.get $2
      i32.trunc_sat_f64_s
      br $~lib/math/rempio2f|inlined.2
     end
     local.get $4
     i32.const 23
     i32.shr_s
     i32.const 152
     i32.sub
     local.tee $7
     i32.const 63
     i32.and
     i64.extend_i32_s
     local.set $8
     local.get $7
     i32.const 6
     i32.shr_s
     i32.const 3
     i32.shl
     i32.const 1616
     i32.add
     local.tee $7
     i64.load $0 offset=8
     local.set $5
     f64.const 8.515303950216386e-20
     local.get $0
     f64.promote_f32
     f64.copysign
     local.get $4
     i32.const 8388607
     i32.and
     i32.const 8388608
     i32.or
     i64.extend_i32_s
     local.tee $9
     local.get $7
     i64.load $0
     local.get $8
     i64.shl
     local.get $5
     i64.const 64
     local.get $8
     i64.sub
     i64.shr_u
     i64.or
     i64.mul
     local.get $8
     i64.const 32
     i64.gt_u
     if (result i64)
      local.get $5
      local.get $8
      i64.const 32
      i64.sub
      i64.shl
      local.get $7
      i64.load $0 offset=16
      i64.const 96
      local.get $8
      i64.sub
      i64.shr_u
      i64.or
     else
      local.get $5
      i64.const 32
      local.get $8
      i64.sub
      i64.shr_u
     end
     local.get $9
     i64.mul
     i64.const 32
     i64.shr_u
     i64.add
     local.tee $5
     i64.const 2
     i64.shl
     local.tee $8
     f64.convert_i64_s
     f64.mul
     global.set $~lib/math/rempio2f_y
     i32.const 0
     local.get $5
     i64.const 62
     i64.shr_u
     local.get $8
     i64.const 63
     i64.shr_u
     i64.add
     i32.wrap_i64
     local.tee $4
     i32.sub
     local.get $4
     local.get $6
     select
    end
    local.set $4
    global.get $~lib/math/rempio2f_y
    local.tee $1
    local.get $1
    f64.mul
    local.tee $2
    local.get $2
    f64.mul
    local.set $3
    f64.const -1
    local.get $1
    local.get $2
    local.get $1
    f64.mul
    local.tee $1
    local.get $2
    f64.const 0.13339200271297674
    f64.mul
    f64.const 0.3333313950307914
    f64.add
    f64.mul
    f64.add
    local.get $1
    local.get $3
    f64.mul
    local.get $2
    f64.const 0.024528318116654728
    f64.mul
    f64.const 0.05338123784456704
    f64.add
    local.get $3
    local.get $2
    f64.const 0.009465647849436732
    f64.mul
    f64.const 0.002974357433599673
    f64.add
    f64.mul
    f64.add
    f64.mul
    f64.add
    local.tee $1
    f64.div
    local.get $1
    local.get $4
    i32.const 1
    i32.and
    select
    f32.demote_f64
    return
   end
   local.get $2
   local.get $1
   local.get $2
   f64.mul
   local.tee $2
   local.get $1
   f64.const 0.13339200271297674
   f64.mul
   f64.const 0.3333313950307914
   f64.add
   f64.mul
   f64.add
   local.get $2
   local.get $3
   f64.mul
   local.get $1
   f64.const 0.024528318116654728
   f64.mul
   f64.const 0.05338123784456704
   f64.add
   local.get $3
   local.get $1
   f64.const 0.009465647849436732
   f64.mul
   f64.const 0.002974357433599673
   f64.add
   f64.mul
   f64.add
   f64.mul
   f64.add
   f32.demote_f64
   return
  end
  f64.const -1
  local.get $2
  local.get $1
  local.get $2
  f64.mul
  local.tee $2
  local.get $1
  f64.const 0.13339200271297674
  f64.mul
  f64.const 0.3333313950307914
  f64.add
  f64.mul
  f64.add
  local.get $2
  local.get $3
  f64.mul
  local.get $1
  f64.const 0.024528318116654728
  f64.mul
  f64.const 0.05338123784456704
  f64.add
  local.get $3
  local.get $1
  f64.const 0.009465647849436732
  f64.mul
  f64.const 0.002974357433599673
  f64.add
  f64.mul
  f64.add
  f64.mul
  f64.add
  f64.div
  f32.demote_f64
 )
 (func $~lib/rt/itcms/__pin (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  if
   local.get $0
   i32.const 20
   i32.sub
   local.tee $1
   i32.load $0 offset=4
   i32.const 3
   i32.and
   i32.const 3
   i32.eq
   if
    i32.const 1680
    i32.const 1232
    i32.const 338
    i32.const 7
    call $~lib/builtins/abort
    unreachable
   end
   local.get $1
   call $~lib/rt/itcms/Object#unlink
   global.get $~lib/rt/itcms/pinSpace
   local.tee $3
   i32.load $0 offset=8
   local.set $2
   local.get $1
   local.get $3
   i32.const 3
   i32.or
   i32.store $0 offset=4
   local.get $1
   local.get $2
   i32.store $0 offset=8
   local.get $2
   local.get $1
   local.get $2
   i32.load $0 offset=4
   i32.const 3
   i32.and
   i32.or
   i32.store $0 offset=4
   local.get $3
   local.get $1
   i32.store $0 offset=8
  end
  local.get $0
 )
 (func $~lib/rt/itcms/__unpin (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.eqz
  if
   return
  end
  local.get $0
  i32.const 20
  i32.sub
  local.tee $1
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.const 3
  i32.ne
  if
   i32.const 1744
   i32.const 1232
   i32.const 352
   i32.const 5
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/itcms/state
  i32.const 1
  i32.eq
  if
   local.get $1
   call $~lib/rt/itcms/Object#makeGray
  else
   local.get $1
   call $~lib/rt/itcms/Object#unlink
   global.get $~lib/rt/itcms/fromSpace
   local.tee $0
   i32.load $0 offset=8
   local.set $2
   local.get $1
   local.get $0
   global.get $~lib/rt/itcms/white
   i32.or
   i32.store $0 offset=4
   local.get $1
   local.get $2
   i32.store $0 offset=8
   local.get $2
   local.get $1
   local.get $2
   i32.load $0 offset=4
   i32.const 3
   i32.and
   i32.or
   i32.store $0 offset=4
   local.get $0
   local.get $1
   i32.store $0 offset=8
  end
 )
 (func $~lib/rt/itcms/__collect
  global.get $~lib/rt/itcms/state
  i32.const 0
  i32.gt_s
  if
   loop $while-continue|0
    global.get $~lib/rt/itcms/state
    if
     call $~lib/rt/itcms/step
     drop
     br $while-continue|0
    end
   end
  end
  call $~lib/rt/itcms/step
  drop
  loop $while-continue|1
   global.get $~lib/rt/itcms/state
   if
    call $~lib/rt/itcms/step
    drop
    br $while-continue|1
   end
  end
  global.get $~lib/rt/itcms/total
  i64.extend_i32_u
  i64.const 200
  i64.mul
  i64.const 100
  i64.div_u
  i32.wrap_i64
  i32.const 1024
  i32.add
  global.set $~lib/rt/itcms/threshold
 )
 (func $~lib/rt/__visit_members (param $0 i32)
  block $folding-inner0
   block $invalid
    block $~lib/string/String
     block $~lib/arraybuffer/ArrayBuffer
      block $~lib/object/Object
       local.get $0
       i32.const 8
       i32.sub
       i32.load $0
       br_table $~lib/object/Object $~lib/arraybuffer/ArrayBuffer $~lib/string/String $folding-inner0 $folding-inner0 $folding-inner0 $invalid
      end
      return
     end
     return
    end
    return
   end
   unreachable
  end
  local.get $0
  i32.load $0
  local.tee $0
  if
   local.get $0
   call $byn-split-outlined-A$~lib/rt/itcms/__visit
  end
 )
 (func $~setArgumentsLength (param $0 i32)
  local.get $0
  global.set $~argumentsLength
 )
 (func $~start
  memory.size $0
  i32.const 16
  i32.shl
  i32.const 34588
  i32.sub
  i32.const 1
  i32.shr_u
  global.set $~lib/rt/itcms/threshold
  i32.const 1284
  i32.const 1280
  i32.store $0
  i32.const 1288
  i32.const 1280
  i32.store $0
  i32.const 1280
  global.set $~lib/rt/itcms/pinSpace
  i32.const 1316
  i32.const 1312
  i32.store $0
  i32.const 1320
  i32.const 1312
  i32.store $0
  i32.const 1312
  global.set $~lib/rt/itcms/toSpace
  i32.const 1460
  i32.const 1456
  i32.store $0
  i32.const 1464
  i32.const 1456
  i32.store $0
  i32.const 1456
  global.set $~lib/rt/itcms/fromSpace
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1820
  i32.lt_s
  if
   i32.const 34608
   i32.const 34656
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  i64.const 0
  i64.store $0
  local.get $3
  i64.const 0
  i64.store $0 offset=8
  local.get $0
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.const 3
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store $0
  end
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0 offset=4
  local.get $0
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#set:buffer
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0 offset=4
  local.get $0
  i32.const 0
  i32.store $0 offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0 offset=4
  local.get $0
  i32.const 0
  i32.store $0 offset=8
  local.get $1
  i32.const 1073741820
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   i32.const 1056
   i32.const 1104
   i32.const 19
   i32.const 57
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $1
  local.get $2
  i32.shl
  local.tee $1
  i32.const 1
  call $~lib/rt/itcms/__new
  local.tee $2
  i32.store $0 offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0 offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store $0 offset=12
  local.get $0
  local.get $2
  call $~lib/arraybuffer/ArrayBufferView#set:buffer
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0 offset=4
  local.get $0
  local.get $2
  i32.store $0 offset=4
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0 offset=4
  local.get $0
  local.get $1
  i32.store $0 offset=8
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/typedarray/Float32Array#__get (param $0 i32) (param $1 i32) (result f32)
  (local $2 f32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1820
  i32.lt_s
  if
   i32.const 34608
   i32.const 34656
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  i32.const 0
  i32.store $0
  local.get $3
  local.get $0
  i32.store $0
  local.get $1
  local.get $0
  i32.load $0 offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1568
   i32.const 1304
   i32.const 64
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  local.get $0
  i32.store $0
  local.get $0
  i32.load $0 offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  f32.load $0
  local.set $2
  local.get $3
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
 )
 (func $~lib/typedarray/Float32Array#__set (param $0 i32) (param $1 i32) (param $2 f32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1820
  i32.lt_s
  if
   i32.const 34608
   i32.const 34656
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  i32.const 0
  i32.store $0
  local.get $3
  local.get $0
  i32.store $0
  local.get $1
  local.get $0
  i32.load $0 offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1568
   i32.const 1315
   i32.const 64
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  local.get $0
  i32.store $0
  local.get $0
  i32.load $0 offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  f32.store $0
  local.get $3
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $src/asm/geometricmapfilter/init_polar (param $0 i32) (param $1 f32) (param $2 f32) (result i32)
  (local $3 i32)
  (local $4 f32)
  (local $5 f32)
  (local $6 f32)
  (local $7 f32)
  (local $8 f32)
  (local $9 f32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1820
  i32.lt_s
  if
   i32.const 34608
   i32.const 34656
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  i32.const 0
  i32.store $0
  local.get $3
  local.get $0
  i32.store $0
  local.get $0
  i32.const 0
  call $~lib/typedarray/Float32Array#__get
  local.get $1
  f32.const -1
  f32.add
  local.tee $4
  f32.mul
  local.set $5
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0
  local.get $0
  i32.const 1
  call $~lib/typedarray/Float32Array#__get
  local.get $2
  f32.const -1
  f32.add
  local.tee $6
  f32.mul
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0
  local.get $0
  i32.const 0
  local.get $5
  call $~lib/typedarray/Float32Array#__set
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0
  local.get $0
  i32.const 1
  local.get $1
  call $~lib/typedarray/Float32Array#__set
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0
  local.get $5
  f32.abs
  local.get $1
  f32.abs
  f32.max
  local.tee $2
  f32.const 0
  f32.eq
  if (result f32)
   f32.const 0
  else
   local.get $2
   local.get $5
   local.get $2
   f32.div
   local.tee $7
   local.get $7
   f32.mul
   local.get $1
   local.get $2
   f32.div
   local.tee $2
   local.get $2
   f32.mul
   f32.add
   f32.sqrt
   f32.mul
  end
  local.set $2
  local.get $5
  local.get $4
  f32.sub
  local.tee $7
  f32.abs
  local.get $1
  f32.abs
  f32.max
  local.tee $8
  f32.const 0
  f32.eq
  if (result f32)
   f32.const 0
  else
   local.get $8
   local.get $7
   local.get $8
   f32.div
   local.tee $7
   local.get $7
   f32.mul
   local.get $1
   local.get $8
   f32.div
   local.tee $7
   local.get $7
   f32.mul
   f32.add
   f32.sqrt
   f32.mul
  end
  local.get $2
  f32.max
  local.set $7
  local.get $5
  f32.abs
  local.get $1
  local.get $6
  f32.sub
  local.tee $8
  f32.abs
  f32.max
  local.tee $9
  f32.const 0
  f32.eq
  if (result f32)
   f32.const 0
  else
   local.get $9
   local.get $5
   local.get $9
   f32.div
   local.tee $2
   local.get $2
   f32.mul
   local.get $8
   local.get $9
   f32.div
   local.tee $2
   local.get $2
   f32.mul
   f32.add
   f32.sqrt
   f32.mul
  end
  local.set $2
  local.get $0
  i32.const 2
  local.get $7
  local.get $5
  local.get $4
  f32.sub
  local.tee $4
  f32.abs
  local.get $1
  local.get $6
  f32.sub
  local.tee $1
  f32.abs
  f32.max
  local.tee $5
  f32.const 0
  f32.eq
  if (result f32)
   f32.const 0
  else
   local.get $5
   local.get $4
   local.get $5
   f32.div
   local.tee $4
   local.get $4
   f32.mul
   local.get $1
   local.get $5
   f32.div
   local.tee $1
   local.get $1
   f32.mul
   f32.add
   f32.sqrt
   f32.mul
  end
  local.get $2
  f32.max
  f32.max
  call $~lib/typedarray/Float32Array#__set
  global.get $~lib/memory/__stack_pointer
  local.get $0
  i32.store $0
  local.get $0
  i32.const 3
  f32.const 6.2831854820251465
  call $~lib/typedarray/Float32Array#__set
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $src/asm/geometricmapfilter/cartesian (param $0 i32) (param $1 i32) (param $2 f32) (param $3 f32) (result i32)
  (local $4 f32)
  (local $5 f32)
  (local $6 i32)
  (local $7 f32)
  (local $8 f32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1820
  i32.lt_s
  if
   i32.const 34608
   i32.const 34656
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $6
  i64.const 0
  i64.store $0
  block $__inlined_func$src/asm/geometricmapfilter/hypot (result f32)
   local.get $6
   local.get $1
   i32.store $0
   local.get $1
   i32.const 4
   call $~lib/typedarray/Float32Array#__get
   f32.const 1
   f32.eq
   if (result f32)
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store $0
    local.get $0
    i32.const 1
    call $~lib/typedarray/Float32Array#__get
    local.set $4
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store $0
    local.get $4
    local.get $1
    i32.const 1
    call $~lib/typedarray/Float32Array#__get
    f32.sub
   else
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store $0
    local.get $0
    i32.const 0
    call $~lib/typedarray/Float32Array#__get
    local.set $4
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store $0
    local.get $4
    local.get $1
    i32.const 0
    call $~lib/typedarray/Float32Array#__get
    f32.sub
   end
   local.tee $4
   f32.abs
   local.set $5
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0
   f32.const 0
   local.get $5
   local.get $1
   i32.const 4
   call $~lib/typedarray/Float32Array#__get
   f32.const 1
   f32.eq
   if (result f32)
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store $0
    local.get $0
    i32.const 0
    call $~lib/typedarray/Float32Array#__get
    local.set $5
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store $0
    local.get $5
    local.get $1
    i32.const 0
    call $~lib/typedarray/Float32Array#__get
    f32.sub
   else
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store $0
    local.get $0
    i32.const 1
    call $~lib/typedarray/Float32Array#__get
    local.set $5
    global.get $~lib/memory/__stack_pointer
    local.get $1
    i32.store $0
    local.get $5
    local.get $1
    i32.const 1
    call $~lib/typedarray/Float32Array#__get
    f32.sub
   end
   local.tee $5
   f32.abs
   f32.max
   local.tee $7
   f32.const 0
   f32.eq
   br_if $__inlined_func$src/asm/geometricmapfilter/hypot
   drop
   local.get $7
   local.get $4
   local.get $7
   f32.div
   local.tee $8
   local.get $8
   f32.mul
   local.get $5
   local.get $7
   f32.div
   local.tee $7
   local.get $7
   f32.mul
   f32.add
   f32.sqrt
   f32.mul
  end
  local.set $7
  local.get $5
  local.get $4
  call $~lib/math/NativeMathf.atan2
  local.tee $4
  f32.const 0
  f32.lt
  if
   local.get $4
   f32.const 6.2831854820251465
   f32.add
   local.set $4
  end
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store $0
  local.get $1
  i32.const 4
  call $~lib/typedarray/Float32Array#__get
  f32.const 1
  f32.eq
  if
   global.get $~lib/memory/__stack_pointer
   local.tee $6
   local.get $0
   i32.store $0
   local.get $6
   local.get $1
   i32.store $0 offset=4
   local.get $0
   i32.const 1
   local.get $3
   f32.const -1
   f32.add
   local.get $7
   f32.mul
   local.get $1
   i32.const 2
   call $~lib/typedarray/Float32Array#__get
   f32.div
   call $~lib/typedarray/Float32Array#__set
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0 offset=4
   local.get $0
   i32.const 0
   local.get $2
   f32.const -1
   f32.add
   local.get $4
   f32.mul
   local.get $1
   i32.const 3
   call $~lib/typedarray/Float32Array#__get
   f32.div
   call $~lib/typedarray/Float32Array#__set
  else
   global.get $~lib/memory/__stack_pointer
   local.tee $6
   local.get $0
   i32.store $0
   local.get $6
   local.get $1
   i32.store $0 offset=4
   local.get $0
   i32.const 0
   local.get $2
   f32.const -1
   f32.add
   local.get $7
   f32.mul
   local.get $1
   i32.const 2
   call $~lib/typedarray/Float32Array#__get
   f32.div
   call $~lib/typedarray/Float32Array#__set
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.get $1
   i32.store $0 offset=4
   local.get $0
   i32.const 1
   local.get $3
   f32.const -1
   f32.add
   local.get $4
   f32.mul
   local.get $1
   i32.const 3
   call $~lib/typedarray/Float32Array#__get
   f32.div
   call $~lib/typedarray/Float32Array#__set
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $src/asm/geometricmapfilter/apply (param $0 i32) (param $1 i32) (param $2 i32) (param $3 f32) (param $4 f32) (result i32)
  (local $5 f32)
  (local $6 f32)
  (local $7 f32)
  (local $8 f32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner3
   block $folding-inner2
    block $folding-inner1
     global.get $~lib/memory/__stack_pointer
     i32.const 1820
     i32.lt_s
     br_if $folding-inner2
     global.get $~lib/memory/__stack_pointer
     i64.const 0
     i64.store $0
     local.get $0
     i32.const 1
     i32.eq
     if
      global.get $~lib/memory/__stack_pointer
      local.tee $0
      local.get $1
      i32.store $0
      local.get $0
      local.get $2
      i32.store $0 offset=4
      local.get $0
      i32.const 8
      i32.sub
      global.set $~lib/memory/__stack_pointer
      global.get $~lib/memory/__stack_pointer
      i32.const 1820
      i32.lt_s
      br_if $folding-inner2
      global.get $~lib/memory/__stack_pointer
      local.tee $0
      i64.const 0
      i64.store $0
      block $__inlined_func$src/asm/geometricmapfilter/hypot (result f32)
       local.get $0
       local.get $1
       i32.store $0
       local.get $1
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       local.set $3
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       local.get $3
       local.get $2
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       f32.sub
       local.set $3
       global.get $~lib/memory/__stack_pointer
       local.get $1
       i32.store $0
       local.get $1
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       f32.const 0
       local.get $3
       f32.abs
       local.get $4
       local.get $2
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       f32.sub
       local.tee $4
       f32.abs
       f32.max
       local.tee $5
       f32.const 0
       f32.eq
       br_if $__inlined_func$src/asm/geometricmapfilter/hypot
       drop
       local.get $5
       local.get $3
       local.get $5
       f32.div
       local.tee $6
       local.get $6
       f32.mul
       local.get $4
       local.get $5
       f32.div
       local.tee $5
       local.get $5
       f32.mul
       f32.add
       f32.sqrt
       f32.mul
      end
      local.set $5
      global.get $~lib/memory/__stack_pointer
      local.get $2
      i32.store $0
      local.get $2
      i32.const 2
      call $~lib/typedarray/Float32Array#__get
      local.get $5
      f32.gt
      if
       local.get $4
       local.get $3
       call $~lib/math/NativeMathf.atan2
       local.set $3
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       local.get $2
       i32.const 3
       call $~lib/typedarray/Float32Array#__get
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       local.get $4
       local.get $2
       i32.const 2
       call $~lib/typedarray/Float32Array#__get
       local.get $5
       f32.sub
       f32.mul
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       local.get $3
       local.get $4
       local.get $2
       i32.const 2
       call $~lib/typedarray/Float32Array#__get
       f32.div
       f32.add
       local.set $3
       global.get $~lib/memory/__stack_pointer
       local.get $1
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0 offset=4
       local.get $1
       i32.const 0
       local.get $2
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       local.get $5
       local.get $3
       call $~lib/math/NativeMathf.cos
       f32.mul
       f32.add
       call $~lib/typedarray/Float32Array#__set
       global.get $~lib/memory/__stack_pointer
       local.get $1
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0 offset=4
       local.get $1
       i32.const 1
       local.get $2
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       local.get $5
       local.get $3
       call $~lib/math/NativeMathf.sin
       f32.mul
       f32.add
       call $~lib/typedarray/Float32Array#__set
      end
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.add
      global.set $~lib/memory/__stack_pointer
      br $folding-inner1
     else
      local.get $0
      i32.const 2
      i32.eq
      if
       global.get $~lib/memory/__stack_pointer
       local.tee $0
       local.get $1
       i32.store $0
       local.get $0
       local.get $2
       i32.store $0 offset=4
       local.get $0
       i32.const 8
       i32.sub
       global.set $~lib/memory/__stack_pointer
       global.get $~lib/memory/__stack_pointer
       i32.const 1820
       i32.lt_s
       br_if $folding-inner2
       global.get $~lib/memory/__stack_pointer
       local.tee $0
       i64.const 0
       i64.store $0
       local.get $0
       local.get $1
       i32.store $0
       local.get $1
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       local.set $3
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       local.get $3
       local.get $2
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       f32.sub
       local.tee $5
       local.get $5
       f32.mul
       local.set $6
       global.get $~lib/memory/__stack_pointer
       local.get $1
       i32.store $0
       local.get $1
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       local.set $3
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       local.get $6
       local.get $3
       local.get $2
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       f32.sub
       local.tee $3
       local.get $3
       f32.mul
       local.tee $7
       f32.add
       local.set $4
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       local.get $2
       i32.const 2
       call $~lib/typedarray/Float32Array#__get
       local.get $4
       f32.gt
       if
        global.get $~lib/memory/__stack_pointer
        local.get $2
        i32.store $0
        local.get $2
        i32.const 2
        call $~lib/typedarray/Float32Array#__get
        local.get $4
        f32.sub
        local.tee $4
        f32.sqrt
        local.set $8
        local.get $5
        local.get $6
        local.get $4
        f32.add
        f32.sqrt
        f32.div
        call $~lib/math/NativeMathf.asin
        f32.const 0.4444440007209778
        f32.mul
        local.set $5
        local.get $3
        local.get $7
        local.get $4
        f32.add
        f32.sqrt
        f32.div
        call $~lib/math/NativeMathf.asin
        f32.const 0.4444440007209778
        f32.mul
        local.set $3
        global.get $~lib/memory/__stack_pointer
        local.get $1
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $1
        i32.store $0 offset=4
        local.get $1
        i32.const 0
        local.get $1
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
        local.get $8
        local.get $5
        call $~lib/math/NativeMathf.tan
        f32.mul
        f32.sub
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $1
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $1
        i32.store $0 offset=4
        local.get $1
        i32.const 1
        local.get $1
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        local.get $8
        local.get $3
        call $~lib/math/NativeMathf.tan
        f32.mul
        f32.sub
        call $~lib/typedarray/Float32Array#__set
       end
       global.get $~lib/memory/__stack_pointer
       i32.const 8
       i32.add
       global.set $~lib/memory/__stack_pointer
       br $folding-inner3
      else
       local.get $0
       i32.const 3
       i32.eq
       if
        global.get $~lib/memory/__stack_pointer
        local.tee $0
        local.get $1
        i32.store $0
        local.get $0
        local.get $2
        i32.store $0 offset=4
        local.get $0
        i32.const 8
        i32.sub
        global.set $~lib/memory/__stack_pointer
        global.get $~lib/memory/__stack_pointer
        i32.const 1820
        i32.lt_s
        br_if $folding-inner2
        global.get $~lib/memory/__stack_pointer
        local.tee $0
        i64.const 0
        i64.store $0
        local.get $0
        local.get $2
        i32.store $0
        local.get $2
        i32.const 4
        call $~lib/typedarray/Float32Array#__get
        f32.const 1
        f32.eq
        if
         global.get $~lib/memory/__stack_pointer
         local.get $2
         i32.store $0
         local.get $2
         i32.const 2
         call $~lib/typedarray/Float32Array#__get
         local.set $5
         global.get $~lib/memory/__stack_pointer
         local.get $1
         i32.store $0
         local.get $5
         local.get $1
         i32.const 1
         call $~lib/typedarray/Float32Array#__get
         f32.mul
         local.get $4
         f32.const -1
         f32.add
         f32.div
         local.set $4
         global.get $~lib/memory/__stack_pointer
         local.get $2
         i32.store $0
         local.get $2
         i32.const 3
         call $~lib/typedarray/Float32Array#__get
         local.set $5
         global.get $~lib/memory/__stack_pointer
         local.get $1
         i32.store $0
         local.get $5
         local.get $1
         i32.const 0
         call $~lib/typedarray/Float32Array#__get
         f32.mul
         local.get $3
         f32.const -1
         f32.add
         f32.div
         local.set $3
         global.get $~lib/memory/__stack_pointer
         local.get $1
         i32.store $0
         local.get $4
         local.get $3
         call $~lib/math/NativeMathf.cos
         f32.mul
         local.set $5
         global.get $~lib/memory/__stack_pointer
         local.get $2
         i32.store $0 offset=4
         local.get $1
         i32.const 1
         local.get $5
         local.get $2
         i32.const 1
         call $~lib/typedarray/Float32Array#__get
         f32.add
         call $~lib/typedarray/Float32Array#__set
         global.get $~lib/memory/__stack_pointer
         local.get $1
         i32.store $0
         local.get $4
         local.get $3
         call $~lib/math/NativeMathf.sin
         f32.mul
         local.set $3
         global.get $~lib/memory/__stack_pointer
         local.get $2
         i32.store $0 offset=4
         local.get $1
         i32.const 0
         local.get $3
         local.get $2
         i32.const 0
         call $~lib/typedarray/Float32Array#__get
         f32.add
         call $~lib/typedarray/Float32Array#__set
        else
         global.get $~lib/memory/__stack_pointer
         local.get $2
         i32.store $0
         local.get $2
         i32.const 2
         call $~lib/typedarray/Float32Array#__get
         local.set $5
         global.get $~lib/memory/__stack_pointer
         local.get $1
         i32.store $0
         local.get $5
         local.get $1
         i32.const 0
         call $~lib/typedarray/Float32Array#__get
         f32.mul
         local.get $3
         f32.const -1
         f32.add
         f32.div
         local.set $3
         global.get $~lib/memory/__stack_pointer
         local.get $2
         i32.store $0
         local.get $2
         i32.const 3
         call $~lib/typedarray/Float32Array#__get
         local.set $5
         global.get $~lib/memory/__stack_pointer
         local.get $1
         i32.store $0
         local.get $5
         local.get $1
         i32.const 1
         call $~lib/typedarray/Float32Array#__get
         f32.mul
         local.get $4
         f32.const -1
         f32.add
         f32.div
         local.set $4
         global.get $~lib/memory/__stack_pointer
         local.get $1
         i32.store $0
         local.get $3
         local.get $4
         call $~lib/math/NativeMathf.cos
         f32.mul
         local.set $5
         global.get $~lib/memory/__stack_pointer
         local.get $2
         i32.store $0 offset=4
         local.get $1
         i32.const 0
         local.get $5
         local.get $2
         i32.const 0
         call $~lib/typedarray/Float32Array#__get
         f32.add
         call $~lib/typedarray/Float32Array#__set
         global.get $~lib/memory/__stack_pointer
         local.get $1
         i32.store $0
         local.get $3
         local.get $4
         call $~lib/math/NativeMathf.sin
         f32.mul
         local.set $3
         global.get $~lib/memory/__stack_pointer
         local.get $2
         i32.store $0 offset=4
         local.get $1
         i32.const 1
         local.get $3
         local.get $2
         i32.const 1
         call $~lib/typedarray/Float32Array#__get
         f32.add
         call $~lib/typedarray/Float32Array#__set
        end
        global.get $~lib/memory/__stack_pointer
        i32.const 8
        i32.add
        global.set $~lib/memory/__stack_pointer
        br $folding-inner1
       else
        local.get $0
        i32.const 4
        i32.eq
        if
         global.get $~lib/memory/__stack_pointer
         local.tee $0
         local.get $1
         i32.store $0
         local.get $0
         local.get $2
         i32.store $0 offset=4
         local.get $1
         local.get $2
         local.get $3
         local.get $4
         call $src/asm/geometricmapfilter/cartesian
         local.set $1
         br $folding-inner1
        end
       end
      end
     end
     br $folding-inner3
    end
    global.get $~lib/memory/__stack_pointer
    i32.const 8
    i32.add
    global.set $~lib/memory/__stack_pointer
    local.get $1
    return
   end
   i32.const 34608
   i32.const 34656
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $~lib/typedarray/Uint8ClampedArray#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1820
  i32.lt_s
  if
   i32.const 34608
   i32.const 34656
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  i32.const 0
  i32.store $0
  local.get $3
  local.get $0
  i32.store $0
  local.get $1
  local.get $0
  i32.load $0 offset=8
  i32.ge_u
  if
   i32.const 1360
   i32.const 1568
   i32.const 320
   i32.const 45
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $3
  local.get $0
  i32.store $0
  local.get $1
  local.get $0
  i32.load $0 offset=4
  i32.add
  i32.const 255
  local.get $2
  i32.sub
  i32.const 31
  i32.shr_s
  local.get $2
  i32.or
  local.get $2
  i32.const 31
  i32.shr_s
  i32.const -1
  i32.xor
  i32.and
  i32.store8 $0
  local.get $3
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/typedarray/Uint8ClampedArray#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1820
  i32.lt_s
  if
   i32.const 34608
   i32.const 34656
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $2
  i32.const 0
  i32.store $0
  local.get $2
  local.get $0
  i32.store $0
  local.get $1
  local.get $0
  i32.load $0 offset=8
  i32.ge_u
  if
   i32.const 1360
   i32.const 1568
   i32.const 309
   i32.const 45
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $2
  local.get $0
  i32.store $0
  local.get $1
  local.get $0
  i32.load $0 offset=4
  i32.add
  i32.load8_u $0
  local.set $0
  local.get $2
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $src/asm/geometricmapfilter/geometricmapfilter (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (result i32)
  (local $7 i32)
  (local $8 f32)
  (local $9 i32)
  (local $10 f32)
  (local $11 f32)
  (local $12 f32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 f32)
  (local $18 i32)
  (local $19 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner3
   global.get $~lib/memory/__stack_pointer
   i32.const 1820
   i32.lt_s
   br_if $folding-inner3
   global.get $~lib/memory/__stack_pointer
   local.tee $13
   i32.const 0
   i32.const 20
   memory.fill $0
   local.get $13
   local.get $0
   local.tee $7
   i32.store $0
   local.get $13
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1820
   i32.lt_s
   br_if $folding-inner3
   global.get $~lib/memory/__stack_pointer
   local.tee $0
   i32.const 0
   i32.store $0
   local.get $0
   local.get $7
   i32.store $0
   local.get $7
   i32.load $0 offset=8
   local.set $13
   local.get $0
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1820
   i32.lt_s
   br_if $folding-inner3
   global.get $~lib/memory/__stack_pointer
   local.tee $14
   i64.const 0
   i64.store $0
   local.get $14
   i32.const 12
   i32.const 4
   call $~lib/rt/itcms/__new
   local.tee $14
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.tee $15
   local.get $14
   i32.store $0 offset=4
   local.get $15
   local.get $14
   local.get $13
   i32.const 0
   call $~lib/arraybuffer/ArrayBufferView#constructor
   local.tee $14
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   local.get $14
   i32.store $0 offset=4
   global.get $~lib/memory/__stack_pointer
   local.set $15
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1820
   i32.lt_s
   br_if $folding-inner3
   global.get $~lib/memory/__stack_pointer
   local.tee $0
   i64.const 0
   i64.store $0
   local.get $0
   i32.const 12
   i32.const 5
   call $~lib/rt/itcms/__new
   local.tee $0
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.tee $16
   local.get $0
   i32.store $0 offset=4
   local.get $16
   local.get $0
   i32.const 2
   i32.const 2
   call $~lib/arraybuffer/ArrayBufferView#constructor
   local.tee $0
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $15
   local.get $0
   i32.store $0 offset=8
   local.get $1
   f32.convert_i32_s
   local.tee $10
   f32.const -1
   f32.add
   local.set $8
   local.get $2
   f32.convert_i32_s
   local.tee $11
   f32.const -1
   f32.add
   local.set $12
   global.get $~lib/memory/__stack_pointer
   local.get $5
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   block $__inlined_func$src/asm/geometricmapfilter/init (result i32)
    global.get $~lib/memory/__stack_pointer
    i32.const 4
    i32.sub
    global.set $~lib/memory/__stack_pointer
    block $folding-inner2
     block $folding-inner1
      global.get $~lib/memory/__stack_pointer
      i32.const 1820
      i32.lt_s
      br_if $folding-inner3
      global.get $~lib/memory/__stack_pointer
      i32.const 0
      i32.store $0
      local.get $4
      i32.const 1
      i32.eq
      if
       global.get $~lib/memory/__stack_pointer
       local.tee $15
       local.get $5
       i32.store $0
       local.get $5
       local.set $2
       local.get $15
       i32.const 8
       i32.sub
       global.set $~lib/memory/__stack_pointer
       global.get $~lib/memory/__stack_pointer
       i32.const 1820
       i32.lt_s
       br_if $folding-inner3
       global.get $~lib/memory/__stack_pointer
       local.tee $5
       i64.const 0
       i64.store $0
       local.get $5
       local.get $2
       i32.store $0
       local.get $5
       local.get $2
       i32.store $0 offset=4
       local.get $2
       i32.const 0
       local.get $2
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       local.get $10
       f32.const -1
       f32.add
       f32.mul
       call $~lib/typedarray/Float32Array#__set
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $2
       i32.store $0 offset=4
       local.get $2
       i32.const 1
       local.get $2
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       local.get $11
       f32.const -1
       f32.add
       f32.mul
       call $~lib/typedarray/Float32Array#__set
       br $folding-inner1
      else
       local.get $4
       i32.const 2
       i32.eq
       if
        global.get $~lib/memory/__stack_pointer
        local.tee $15
        local.get $5
        i32.store $0
        local.get $5
        local.set $2
        local.get $15
        i32.const 8
        i32.sub
        global.set $~lib/memory/__stack_pointer
        global.get $~lib/memory/__stack_pointer
        i32.const 1820
        i32.lt_s
        br_if $folding-inner3
        global.get $~lib/memory/__stack_pointer
        local.tee $5
        i64.const 0
        i64.store $0
        local.get $5
        local.get $2
        i32.store $0
        local.get $5
        local.get $2
        i32.store $0 offset=4
        local.get $2
        i32.const 0
        local.get $2
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
        local.get $10
        f32.const -1
        f32.add
        f32.mul
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $2
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $2
        i32.store $0 offset=4
        local.get $2
        i32.const 1
        local.get $2
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        local.get $11
        f32.const -1
        f32.add
        f32.mul
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $2
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $2
        i32.store $0 offset=4
        local.get $2
        i32.const 2
        call $~lib/typedarray/Float32Array#__get
        local.set $17
        global.get $~lib/memory/__stack_pointer
        local.get $2
        i32.store $0 offset=4
        local.get $2
        i32.const 2
        local.get $17
        local.get $2
        i32.const 2
        call $~lib/typedarray/Float32Array#__get
        f32.mul
        call $~lib/typedarray/Float32Array#__set
        br $folding-inner1
       else
        local.get $4
        i32.const 3
        i32.eq
        if
         br $folding-inner2
        else
         local.get $4
         i32.const 4
         i32.eq
         br_if $folding-inner2
        end
       end
      end
      global.get $~lib/memory/__stack_pointer
      i32.const 4
      i32.add
      global.set $~lib/memory/__stack_pointer
      local.get $5
      br $__inlined_func$src/asm/geometricmapfilter/init
     end
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.add
     global.set $~lib/memory/__stack_pointer
     local.get $2
     br $__inlined_func$src/asm/geometricmapfilter/init
    end
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store $0
    local.get $5
    local.get $10
    local.get $11
    call $src/asm/geometricmapfilter/init_polar
    local.set $2
    global.get $~lib/memory/__stack_pointer
    i32.const 4
    i32.add
    global.set $~lib/memory/__stack_pointer
    local.get $2
   end
   local.tee $15
   i32.store $0 offset=12
   local.get $3
   i32.const 3
   i32.eq
   if
    local.get $6
    i32.const 24
    i32.shr_u
    local.set $16
    local.get $6
    i32.const 16
    i32.shr_u
    i32.const 255
    i32.and
    local.set $5
    local.get $6
    i32.const 8
    i32.shr_u
    i32.const 255
    i32.and
    local.set $18
    local.get $6
    i32.const 255
    i32.and
    local.set $6
    i32.const 0
    local.set $3
    i32.const 0
    local.set $2
    loop $for-loop|0
     local.get $2
     local.get $13
     i32.lt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0
      local.get $1
      local.get $3
      i32.le_s
      if
       local.get $9
       i32.const 1
       i32.add
       local.set $9
       i32.const 0
       local.set $3
      end
      local.get $0
      i32.const 0
      local.get $3
      f32.convert_i32_s
      call $~lib/typedarray/Float32Array#__set
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0
      local.get $0
      i32.const 1
      local.get $9
      f32.convert_i32_s
      call $~lib/typedarray/Float32Array#__set
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $15
      i32.store $0 offset=16
      global.get $~lib/memory/__stack_pointer
      local.get $4
      local.get $0
      local.get $15
      local.get $10
      local.get $11
      call $src/asm/geometricmapfilter/apply
      local.tee $0
      i32.store $0 offset=8
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0
      block $for-continue|0
       local.get $0
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       f32.const 0
       f32.lt
       if (result i32)
        i32.const 1
       else
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
        local.get $8
        f32.gt
       end
       if (result i32)
        i32.const 1
       else
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        f32.const 0
        f32.lt
       end
       if (result i32)
        i32.const 1
       else
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        local.get $12
        f32.gt
       end
       if
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        local.get $14
        local.get $2
        local.get $5
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        local.get $14
        local.get $2
        i32.const 1
        i32.add
        local.get $18
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        local.get $14
        local.get $2
        i32.const 2
        i32.add
        local.get $6
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        local.get $14
        local.get $2
        i32.const 3
        i32.add
        local.get $16
        call $~lib/typedarray/Uint8ClampedArray#__set
        br $for-continue|0
       end
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $0
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       i32.trunc_sat_f32_s
       local.set $19
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $19
       local.get $0
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       i32.trunc_sat_f32_s
       local.get $1
       i32.mul
       i32.add
       i32.const 2
       i32.shl
       local.set $19
       global.get $~lib/memory/__stack_pointer
       local.get $14
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store $0 offset=16
       local.get $14
       local.get $2
       local.get $7
       local.get $19
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $14
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store $0 offset=16
       local.get $14
       local.get $2
       i32.const 1
       i32.add
       local.get $7
       local.get $19
       i32.const 1
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $14
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store $0 offset=16
       local.get $14
       local.get $2
       i32.const 2
       i32.add
       local.get $7
       local.get $19
       i32.const 2
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $14
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store $0 offset=16
       local.get $14
       local.get $2
       i32.const 3
       i32.add
       local.get $7
       local.get $19
       i32.const 3
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
      end
      local.get $2
      i32.const 4
      i32.add
      local.set $2
      local.get $3
      i32.const 1
      i32.add
      local.set $3
      br $for-loop|0
     end
    end
   else
    local.get $3
    if
     local.get $3
     i32.const 1
     i32.eq
     if
      i32.const 0
      local.set $3
      i32.const 0
      local.set $2
      loop $for-loop|2
       local.get $2
       local.get $13
       i32.lt_s
       if
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $1
        local.get $3
        i32.le_s
        if
         local.get $9
         i32.const 1
         i32.add
         local.set $9
         i32.const 0
         local.set $3
        end
        local.get $0
        i32.const 0
        local.get $3
        f32.convert_i32_s
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        i32.const 1
        local.get $9
        f32.convert_i32_s
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $15
        i32.store $0 offset=16
        global.get $~lib/memory/__stack_pointer
        local.get $4
        local.get $0
        local.get $15
        local.get $10
        local.get $11
        call $src/asm/geometricmapfilter/apply
        local.tee $0
        i32.store $0 offset=8
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0 offset=16
        local.get $0
        i32.const 1
        local.get $0
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        local.get $12
        f32.gt
        if (result f32)
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0 offset=16
         local.get $0
         i32.const 1
         call $~lib/typedarray/Float32Array#__get
         local.get $11
         f32.sub
        else
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0 offset=16
         local.get $0
         i32.const 1
         call $~lib/typedarray/Float32Array#__get
         f32.const 0
         f32.lt
         if (result f32)
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0 offset=16
          local.get $0
          i32.const 1
          call $~lib/typedarray/Float32Array#__get
          local.get $11
          f32.add
         else
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0 offset=16
          local.get $0
          i32.const 1
          call $~lib/typedarray/Float32Array#__get
         end
        end
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.tee $5
        local.get $0
        i32.store $0
        local.get $5
        local.get $0
        i32.store $0 offset=16
        local.get $0
        i32.const 0
        local.get $0
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
        local.get $8
        f32.gt
        if (result f32)
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0 offset=16
         local.get $0
         i32.const 0
         call $~lib/typedarray/Float32Array#__get
         local.get $10
         f32.sub
        else
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0 offset=16
         local.get $0
         i32.const 0
         call $~lib/typedarray/Float32Array#__get
         f32.const 0
         f32.lt
         if (result f32)
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0 offset=16
          local.get $0
          i32.const 0
          call $~lib/typedarray/Float32Array#__get
          local.get $10
          f32.add
         else
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0 offset=16
          local.get $0
          i32.const 0
          call $~lib/typedarray/Float32Array#__get
         end
        end
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
        i32.trunc_sat_f32_s
        local.set $5
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $5
        local.get $0
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        i32.trunc_sat_f32_s
        local.get $1
        i32.mul
        i32.add
        i32.const 2
        i32.shl
        local.set $5
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $7
        i32.store $0 offset=16
        local.get $14
        local.get $2
        local.get $7
        local.get $5
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $7
        i32.store $0 offset=16
        local.get $14
        local.get $2
        i32.const 1
        i32.add
        local.get $7
        local.get $5
        i32.const 1
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $7
        i32.store $0 offset=16
        local.get $14
        local.get $2
        i32.const 2
        i32.add
        local.get $7
        local.get $5
        i32.const 2
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $7
        i32.store $0 offset=16
        local.get $14
        local.get $2
        i32.const 3
        i32.add
        local.get $7
        local.get $5
        i32.const 3
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        local.get $2
        i32.const 4
        i32.add
        local.set $2
        local.get $3
        i32.const 1
        i32.add
        local.set $3
        br $for-loop|2
       end
      end
     else
      i32.const 0
      local.set $3
      i32.const 0
      local.set $2
      loop $for-loop|3
       local.get $2
       local.get $13
       i32.lt_s
       if
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $1
        local.get $3
        i32.le_s
        if
         local.get $9
         i32.const 1
         i32.add
         local.set $9
         i32.const 0
         local.set $3
        end
        local.get $0
        i32.const 0
        local.get $3
        f32.convert_i32_s
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        i32.const 1
        local.get $9
        f32.convert_i32_s
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $15
        i32.store $0 offset=16
        global.get $~lib/memory/__stack_pointer
        local.get $4
        local.get $0
        local.get $15
        local.get $10
        local.get $11
        call $src/asm/geometricmapfilter/apply
        local.tee $0
        i32.store $0 offset=8
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0 offset=16
        local.get $0
        i32.const 1
        local.get $0
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        local.get $12
        f32.gt
        if (result f32)
         local.get $12
        else
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0 offset=16
         local.get $0
         i32.const 1
         call $~lib/typedarray/Float32Array#__get
         f32.const 0
         f32.lt
         if (result f32)
          f32.const 0
         else
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0 offset=16
          local.get $0
          i32.const 1
          call $~lib/typedarray/Float32Array#__get
         end
        end
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.tee $5
        local.get $0
        i32.store $0
        local.get $5
        local.get $0
        i32.store $0 offset=16
        local.get $0
        i32.const 0
        local.get $0
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
        local.get $8
        f32.gt
        if (result f32)
         local.get $8
        else
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0 offset=16
         local.get $0
         i32.const 0
         call $~lib/typedarray/Float32Array#__get
         f32.const 0
         f32.lt
         if (result f32)
          f32.const 0
         else
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0 offset=16
          local.get $0
          i32.const 0
          call $~lib/typedarray/Float32Array#__get
         end
        end
        call $~lib/typedarray/Float32Array#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
        i32.trunc_sat_f32_s
        local.set $5
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $5
        local.get $0
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        i32.trunc_sat_f32_s
        local.get $1
        i32.mul
        i32.add
        i32.const 2
        i32.shl
        local.set $5
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $7
        i32.store $0 offset=16
        local.get $14
        local.get $2
        local.get $7
        local.get $5
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $7
        i32.store $0 offset=16
        local.get $14
        local.get $2
        i32.const 1
        i32.add
        local.get $7
        local.get $5
        i32.const 1
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $7
        i32.store $0 offset=16
        local.get $14
        local.get $2
        i32.const 2
        i32.add
        local.get $7
        local.get $5
        i32.const 2
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $14
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $7
        i32.store $0 offset=16
        local.get $14
        local.get $2
        i32.const 3
        i32.add
        local.get $7
        local.get $5
        i32.const 3
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        local.get $2
        i32.const 4
        i32.add
        local.set $2
        local.get $3
        i32.const 1
        i32.add
        local.set $3
        br $for-loop|3
       end
      end
     end
    else
     i32.const 0
     local.set $3
     i32.const 0
     local.set $2
     loop $for-loop|1
      local.get $2
      local.get $13
      i32.lt_s
      if
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $1
       local.get $3
       i32.le_s
       if
        local.get $9
        i32.const 1
        i32.add
        local.set $9
        i32.const 0
        local.set $3
       end
       local.get $0
       i32.const 0
       local.get $3
       f32.convert_i32_s
       call $~lib/typedarray/Float32Array#__set
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $0
       i32.const 1
       local.get $9
       f32.convert_i32_s
       call $~lib/typedarray/Float32Array#__set
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $15
       i32.store $0 offset=16
       global.get $~lib/memory/__stack_pointer
       local.get $4
       local.get $0
       local.get $15
       local.get $10
       local.get $11
       call $src/asm/geometricmapfilter/apply
       local.tee $0
       i32.store $0 offset=8
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0 offset=16
       local.get $0
       i32.const 1
       local.get $0
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       local.get $12
       f32.gt
       if (result i32)
        i32.const 1
       else
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0 offset=16
        local.get $0
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
        f32.const 0
        f32.lt
       end
       if (result f32)
        local.get $9
        f32.convert_i32_s
       else
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0 offset=16
        local.get $0
        i32.const 1
        call $~lib/typedarray/Float32Array#__get
       end
       call $~lib/typedarray/Float32Array#__set
       global.get $~lib/memory/__stack_pointer
       local.tee $5
       local.get $0
       i32.store $0
       local.get $5
       local.get $0
       i32.store $0 offset=16
       local.get $0
       i32.const 0
       local.get $0
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       local.get $8
       f32.gt
       if (result i32)
        i32.const 1
       else
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0 offset=16
        local.get $0
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
        f32.const 0
        f32.lt
       end
       if (result f32)
        local.get $3
        f32.convert_i32_s
       else
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0 offset=16
        local.get $0
        i32.const 0
        call $~lib/typedarray/Float32Array#__get
       end
       call $~lib/typedarray/Float32Array#__set
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $0
       i32.const 0
       call $~lib/typedarray/Float32Array#__get
       i32.trunc_sat_f32_s
       local.set $5
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $5
       local.get $0
       i32.const 1
       call $~lib/typedarray/Float32Array#__get
       i32.trunc_sat_f32_s
       local.get $1
       i32.mul
       i32.add
       i32.const 2
       i32.shl
       local.set $5
       global.get $~lib/memory/__stack_pointer
       local.get $14
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store $0 offset=16
       local.get $14
       local.get $2
       local.get $7
       local.get $5
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $14
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store $0 offset=16
       local.get $14
       local.get $2
       i32.const 1
       i32.add
       local.get $7
       local.get $5
       i32.const 1
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $14
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store $0 offset=16
       local.get $14
       local.get $2
       i32.const 2
       i32.add
       local.get $7
       local.get $5
       i32.const 2
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $14
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $7
       i32.store $0 offset=16
       local.get $14
       local.get $2
       i32.const 3
       i32.add
       local.get $7
       local.get $5
       i32.const 3
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       local.get $2
       i32.const 4
       i32.add
       local.set $2
       local.get $3
       i32.const 1
       i32.add
       local.set $3
       br $for-loop|1
      end
     end
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 20
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $14
   return
  end
  i32.const 34608
  i32.const 34656
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $export:src/asm/geometricmapfilter/geometricmapfilter@varargs (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (result i32)
  (local $7 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 1820
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $7
   local.get $0
   i32.store $0
   local.get $7
   local.get $5
   i32.store $0 offset=4
   local.get $7
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1820
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i64.const 0
   i64.store $0
   block $1of1
    block $0of1
     block $outOfRange
      global.get $~argumentsLength
      i32.const 6
      i32.sub
      br_table $0of1 $1of1 $outOfRange
     end
     unreachable
    end
    i32.const 0
    local.set $6
   end
   global.get $~lib/memory/__stack_pointer
   local.tee $7
   local.get $0
   i32.store $0
   local.get $7
   local.get $5
   i32.store $0 offset=4
   local.get $0
   local.get $1
   local.get $2
   local.get $3
   local.get $4
   local.get $5
   local.get $6
   call $src/asm/geometricmapfilter/geometricmapfilter
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 34608
  i32.const 34656
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $byn-split-outlined-A$~lib/rt/itcms/__visit (param $0 i32)
  global.get $~lib/rt/itcms/white
  local.get $0
  i32.const 20
  i32.sub
  local.tee $0
  i32.load $0 offset=4
  i32.const 3
  i32.and
  i32.eq
  if
   local.get $0
   call $~lib/rt/itcms/Object#makeGray
   global.get $~lib/rt/itcms/visitCount
   i32.const 1
   i32.add
   global.set $~lib/rt/itcms/visitCount
  end
 )
)
