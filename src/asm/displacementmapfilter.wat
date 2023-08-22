(module
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_none (func))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_i32_i32_i32_i32_i32_i32_f32_f32_i32_i32_f32_f32_i32_=>_i32 (func (param i32 i32 i32 i32 i32 i32 i32 f32 f32 i32 i32 f32 f32 i32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i64_=>_none (func (param i32 i32 i64)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
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
 (global $~lib/rt/__rtti_base i32 (i32.const 1744))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 34540))
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
 (data $11 (i32.const 1612) "<")
 (data $11.1 (i32.const 1624) "\02\00\00\00*\00\00\00O\00b\00j\00e\00c\00t\00 \00a\00l\00r\00e\00a\00d\00y\00 \00p\00i\00n\00n\00e\00d")
 (data $12 (i32.const 1676) "<")
 (data $12.1 (i32.const 1688) "\02\00\00\00(\00\00\00O\00b\00j\00e\00c\00t\00 \00i\00s\00 \00n\00o\00t\00 \00p\00i\00n\00n\00e\00d")
 (data $13 (i32.const 1744) "\06\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00A\00\00\00\81\08")
 (export "__new" (func $~lib/rt/itcms/__new))
 (export "__pin" (func $~lib/rt/itcms/__pin))
 (export "__unpin" (func $~lib/rt/itcms/__unpin))
 (export "__collect" (func $~lib/rt/itcms/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "memory" (memory $0))
 (export "displacementmapfilter" (func $export:src/asm/displacementmapfilter/displacementmapfilter))
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
  i32.const 1632
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1696
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
   i32.const 34540
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
   i32.const 1744
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
   i32.const 1748
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
  i32.const 34544
  i32.const 0
  i32.store $0
  i32.const 36112
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
    i32.const 34544
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
      i32.const 34544
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
  i32.const 34544
  i32.const 36116
  memory.size $0
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  i32.const 34544
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
      i32.const 34540
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
    i32.const 34540
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
     i32.const 34540
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
    i32.const 1632
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
   i32.const 1696
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
 (func $~start
  memory.size $0
  i32.const 16
  i32.shl
  i32.const 34540
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
 (func $~lib/typedarray/Uint8ClampedArray#get:length (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1772
  i32.lt_s
  if
   i32.const 34560
   i32.const 34608
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $1
  i32.const 0
  i32.store $0
  local.get $1
  local.get $0
  i32.store $0
  local.get $0
  i32.load $0 offset=8
  local.set $0
  local.get $1
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1772
  i32.lt_s
  if
   i32.const 34560
   i32.const 34608
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
 (func $~lib/typedarray/Uint8ClampedArray#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1772
  i32.lt_s
  if
   i32.const 34560
   i32.const 34608
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
 (func $~lib/typedarray/Int16Array#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1772
  i32.lt_s
  if
   i32.const 34560
   i32.const 34608
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
  i32.const 1
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1568
   i32.const 463
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
  i32.const 1
  i32.shl
  i32.add
  local.get $2
  i32.store16 $0
  local.get $3
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/typedarray/Int16Array#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1772
  i32.lt_s
  if
   i32.const 34560
   i32.const 34608
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
  i32.const 1
  i32.shr_u
  i32.ge_u
  if
   i32.const 1360
   i32.const 1568
   i32.const 452
   i32.const 64
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $2
  local.get $0
  i32.store $0
  local.get $0
  i32.load $0 offset=4
  local.get $1
  i32.const 1
  i32.shl
  i32.add
  i32.load16_s $0
  local.set $0
  local.get $2
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/typedarray/Uint8ClampedArray#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1772
  i32.lt_s
  if
   i32.const 34560
   i32.const 34608
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
 (func $src/asm/displacementmapfilter/displacementmapfilter (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (param $7 f32) (param $8 f32) (param $9 i32) (param $10 i32) (param $11 f32) (param $12 f32) (param $13 i32) (result i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (local $28 i32)
  (local $29 i32)
  (local $30 i32)
  (local $31 i32)
  (local $32 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 1772
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $16
   i64.const 0
   i64.store $0
   local.get $16
   i64.const 0
   i64.store $0 offset=8
   local.get $16
   local.get $0
   i32.store $0
   local.get $0
   call $~lib/typedarray/Uint8ClampedArray#get:length
   local.set $21
   global.get $~lib/memory/__stack_pointer
   local.get $4
   i32.store $0
   local.get $4
   call $~lib/typedarray/Uint8ClampedArray#get:length
   local.tee $22
   i32.const 2
   i32.shr_u
   local.set $23
   local.get $5
   local.get $1
   local.get $1
   local.get $5
   i32.gt_s
   select
   local.tee $17
   local.get $6
   local.get $2
   local.get $2
   local.get $6
   i32.gt_s
   select
   i32.mul
   i32.const 2
   i32.shl
   local.set $18
   local.get $8
   local.get $2
   i32.const 1
   i32.sub
   local.tee $24
   f32.convert_i32_s
   f32.mul
   i32.trunc_sat_f32_s
   local.tee $25
   local.get $1
   i32.mul
   local.set $19
   i32.const 0
   local.get $7
   local.get $1
   i32.const 1
   i32.sub
   local.tee $6
   f32.convert_i32_s
   f32.mul
   i32.trunc_sat_f32_s
   local.tee $16
   i32.sub
   local.set $20
   global.get $~lib/memory/__stack_pointer
   local.set $26
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1772
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $27
   i64.const 0
   i64.store $0
   local.get $27
   i32.const 12
   i32.const 4
   call $~lib/rt/itcms/__new
   local.tee $27
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.tee $28
   local.get $27
   i32.store $0 offset=4
   local.get $28
   local.get $27
   local.get $21
   i32.const 0
   call $~lib/arraybuffer/ArrayBufferView#constructor
   local.tee $21
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $26
   local.get $21
   i32.store $0 offset=4
   global.get $~lib/memory/__stack_pointer
   local.get $21
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0 offset=8
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1772
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $26
   i64.const 0
   i64.store $0
   local.get $26
   i32.const 0
   i32.store $0 offset=8
   local.get $26
   local.get $21
   i32.store $0
   local.get $26
   local.get $0
   i32.store $0 offset=4
   local.get $26
   local.get $0
   i32.store $0 offset=8
   local.get $0
   call $~lib/typedarray/Uint8ClampedArray#get:length
   local.set $26
   global.get $~lib/memory/__stack_pointer
   local.get $21
   i32.store $0 offset=8
   local.get $21
   call $~lib/typedarray/Uint8ClampedArray#get:length
   local.get $26
   i32.lt_s
   if
    i32.const 1360
    i32.const 1568
    i32.const 1902
    i32.const 5
    call $~lib/builtins/abort
    unreachable
   end
   global.get $~lib/memory/__stack_pointer
   local.tee $27
   local.get $21
   i32.store $0 offset=8
   local.get $21
   i32.load $0 offset=4
   local.set $28
   local.get $27
   local.get $0
   i32.store $0 offset=8
   local.get $28
   local.get $0
   i32.load $0 offset=4
   local.get $26
   memory.copy $0 $0
   local.get $27
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.set $26
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1772
   i32.lt_s
   br_if $folding-inner0
   local.get $11
   f32.const 0.00390625
   f32.mul
   local.set $7
   local.get $12
   f32.const 0.00390625
   f32.mul
   local.set $8
   i32.const 0
   local.get $25
   i32.sub
   local.set $27
   local.get $6
   local.get $16
   i32.sub
   local.set $28
   local.get $24
   local.get $25
   i32.sub
   local.set $29
   global.get $~lib/memory/__stack_pointer
   local.tee $30
   i64.const 0
   i64.store $0
   local.get $30
   i32.const 12
   i32.const 5
   call $~lib/rt/itcms/__new
   local.tee $30
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   local.tee $31
   local.get $30
   i32.store $0 offset=4
   local.get $31
   local.get $30
   local.get $23
   i32.const 1
   i32.shl
   i32.const 1
   call $~lib/arraybuffer/ArrayBufferView#constructor
   local.tee $23
   i32.store $0
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $26
   local.get $23
   i32.store $0 offset=12
   loop $for-loop|0
    local.get $15
    local.get $22
    i32.lt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.tee $26
     local.get $23
     i32.store $0
     local.get $26
     local.get $4
     i32.store $0 offset=8
     local.get $23
     local.get $14
     local.get $4
     local.get $9
     local.get $15
     i32.add
     call $~lib/typedarray/Uint8ClampedArray#__get
     i32.const 128
     i32.sub
     f32.convert_i32_u
     local.get $7
     f32.mul
     i32.trunc_sat_f32_s
     i32.extend16_s
     call $~lib/typedarray/Int16Array#__set
     global.get $~lib/memory/__stack_pointer
     local.get $23
     i32.store $0
     local.get $14
     i32.const 1
     i32.add
     local.tee $26
     i32.const 1
     i32.add
     local.set $14
     global.get $~lib/memory/__stack_pointer
     local.get $4
     i32.store $0 offset=8
     local.get $23
     local.get $26
     local.get $4
     local.get $10
     local.get $15
     i32.add
     call $~lib/typedarray/Uint8ClampedArray#__get
     i32.const 128
     i32.sub
     f32.convert_i32_u
     local.get $8
     f32.mul
     i32.trunc_sat_f32_s
     i32.extend16_s
     call $~lib/typedarray/Int16Array#__set
     local.get $15
     i32.const 4
     i32.add
     local.set $15
     br $for-loop|0
    end
   end
   local.get $3
   i32.const 3
   i32.eq
   if
    local.get $13
    i32.const 24
    i32.shr_u
    local.set $10
    local.get $13
    i32.const 16
    i32.shr_u
    i32.const 255
    i32.and
    local.set $14
    local.get $13
    i32.const 8
    i32.shr_u
    i32.const 255
    i32.and
    local.set $22
    local.get $13
    i32.const 255
    i32.and
    local.set $26
    i32.const 0
    local.set $3
    i32.const 0
    local.set $4
    i32.const 0
    local.set $13
    i32.const 0
    local.set $9
    i32.const 0
    local.set $15
    loop $for-loop|1
     local.get $15
     local.get $18
     i32.lt_s
     if
      local.get $3
      local.get $17
      i32.ge_s
      if
       local.get $4
       i32.const 1
       i32.add
       local.set $4
       local.get $1
       local.get $13
       i32.add
       local.set $13
       local.get $5
       local.get $9
       i32.add
       local.set $9
       i32.const 0
       local.set $3
      end
      block $for-continue|1
       local.get $4
       local.get $27
       i32.lt_s
       local.get $4
       local.get $29
       i32.gt_s
       i32.or
       local.get $3
       local.get $20
       i32.lt_s
       i32.or
       local.get $3
       local.get $28
       i32.gt_s
       i32.or
       br_if $for-continue|1
       local.get $3
       local.get $16
       i32.add
       local.tee $2
       local.get $13
       i32.add
       local.get $19
       i32.add
       i32.const 2
       i32.shl
       local.set $30
       global.get $~lib/memory/__stack_pointer
       local.get $23
       i32.store $0
       local.get $23
       local.get $3
       local.get $9
       i32.add
       i32.const 1
       i32.shl
       local.tee $31
       call $~lib/typedarray/Int16Array#__get
       local.get $2
       i32.add
       local.set $32
       global.get $~lib/memory/__stack_pointer
       local.get $23
       i32.store $0
       local.get $23
       local.get $31
       i32.const 1
       i32.add
       call $~lib/typedarray/Int16Array#__get
       local.get $4
       local.get $25
       i32.add
       i32.add
       local.tee $31
       i32.const 0
       i32.lt_s
       local.get $24
       local.get $31
       i32.lt_s
       i32.or
       local.get $6
       local.get $32
       i32.lt_s
       i32.or
       local.get $32
       i32.const 0
       i32.lt_s
       i32.or
       if
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        local.get $30
        local.get $14
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        local.get $30
        i32.const 1
        i32.add
        local.get $22
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        local.get $30
        i32.const 2
        i32.add
        local.get $26
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        local.get $0
        local.get $30
        i32.const 3
        i32.add
        local.get $10
        call $~lib/typedarray/Uint8ClampedArray#__set
        br $for-continue|1
       end
       global.get $~lib/memory/__stack_pointer
       local.tee $2
       local.get $0
       i32.store $0
       local.get $2
       local.get $21
       i32.store $0 offset=8
       local.get $0
       local.get $30
       local.get $21
       local.get $32
       local.get $1
       local.get $31
       i32.mul
       i32.add
       i32.const 2
       i32.shl
       local.tee $2
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $21
       i32.store $0 offset=8
       local.get $0
       local.get $30
       i32.const 1
       i32.add
       local.get $21
       local.get $2
       i32.const 1
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $21
       i32.store $0 offset=8
       local.get $0
       local.get $30
       i32.const 2
       i32.add
       local.get $21
       local.get $2
       i32.const 2
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       global.get $~lib/memory/__stack_pointer
       local.get $21
       i32.store $0 offset=8
       local.get $0
       local.get $30
       i32.const 3
       i32.add
       local.get $21
       local.get $2
       i32.const 3
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       call $~lib/typedarray/Uint8ClampedArray#__set
      end
      local.get $15
      i32.const 4
      i32.add
      local.set $15
      local.get $3
      i32.const 1
      i32.add
      local.set $3
      br $for-loop|1
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
      local.set $4
      i32.const 0
      local.set $13
      i32.const 0
      local.set $9
      i32.const 0
      local.set $15
      loop $for-loop|3
       local.get $15
       local.get $18
       i32.lt_s
       if
        local.get $3
        local.get $17
        i32.ge_s
        if
         local.get $4
         i32.const 1
         i32.add
         local.set $4
         local.get $1
         local.get $13
         i32.add
         local.set $13
         local.get $5
         local.get $9
         i32.add
         local.set $9
         i32.const 0
         local.set $3
        end
        local.get $4
        local.get $27
        i32.lt_s
        local.get $4
        local.get $29
        i32.gt_s
        i32.or
        local.get $3
        local.get $20
        i32.lt_s
        i32.or
        local.get $3
        local.get $28
        i32.gt_s
        i32.or
        i32.eqz
        if
         local.get $3
         local.get $16
         i32.add
         local.tee $10
         local.get $13
         i32.add
         local.get $19
         i32.add
         i32.const 2
         i32.shl
         local.set $14
         global.get $~lib/memory/__stack_pointer
         local.get $23
         i32.store $0
         local.get $23
         local.get $3
         local.get $9
         i32.add
         i32.const 1
         i32.shl
         local.tee $22
         call $~lib/typedarray/Int16Array#__get
         local.get $10
         i32.add
         local.set $10
         global.get $~lib/memory/__stack_pointer
         local.get $23
         i32.store $0
         local.get $23
         local.get $22
         i32.const 1
         i32.add
         call $~lib/typedarray/Int16Array#__get
         local.get $4
         local.get $25
         i32.add
         i32.add
         local.tee $22
         local.get $2
         i32.sub
         local.get $2
         local.get $22
         i32.add
         local.get $22
         local.get $22
         i32.const 0
         i32.lt_s
         select
         local.get $22
         local.get $24
         i32.gt_s
         select
         local.get $1
         i32.mul
         local.get $10
         local.get $1
         i32.sub
         local.get $1
         local.get $10
         i32.add
         local.get $10
         local.get $10
         i32.const 0
         i32.lt_s
         select
         local.get $6
         local.get $10
         i32.lt_s
         select
         i32.add
         i32.const 2
         i32.shl
         local.set $10
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         global.get $~lib/memory/__stack_pointer
         local.get $21
         i32.store $0 offset=8
         local.get $0
         local.get $14
         local.get $21
         local.get $10
         call $~lib/typedarray/Uint8ClampedArray#__get
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         global.get $~lib/memory/__stack_pointer
         local.get $21
         i32.store $0 offset=8
         local.get $0
         local.get $14
         i32.const 1
         i32.add
         local.get $21
         local.get $10
         i32.const 1
         i32.add
         call $~lib/typedarray/Uint8ClampedArray#__get
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         global.get $~lib/memory/__stack_pointer
         local.get $21
         i32.store $0 offset=8
         local.get $0
         local.get $14
         i32.const 2
         i32.add
         local.get $21
         local.get $10
         i32.const 2
         i32.add
         call $~lib/typedarray/Uint8ClampedArray#__get
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         global.get $~lib/memory/__stack_pointer
         local.get $21
         i32.store $0 offset=8
         local.get $0
         local.get $14
         i32.const 3
         i32.add
         local.get $21
         local.get $10
         i32.const 3
         i32.add
         call $~lib/typedarray/Uint8ClampedArray#__get
         call $~lib/typedarray/Uint8ClampedArray#__set
        end
        local.get $15
        i32.const 4
        i32.add
        local.set $15
        local.get $3
        i32.const 1
        i32.add
        local.set $3
        br $for-loop|3
       end
      end
     else
      i32.const 0
      local.set $3
      i32.const 0
      local.set $4
      i32.const 0
      local.set $13
      i32.const 0
      local.set $9
      i32.const 0
      local.set $15
      loop $for-loop|4
       local.get $15
       local.get $18
       i32.lt_s
       if
        local.get $3
        local.get $17
        i32.ge_s
        if
         local.get $4
         i32.const 1
         i32.add
         local.set $4
         local.get $1
         local.get $13
         i32.add
         local.set $13
         local.get $5
         local.get $9
         i32.add
         local.set $9
         i32.const 0
         local.set $3
        end
        local.get $4
        local.get $27
        i32.lt_s
        local.get $4
        local.get $29
        i32.gt_s
        i32.or
        local.get $3
        local.get $20
        i32.lt_s
        i32.or
        local.get $3
        local.get $28
        i32.gt_s
        i32.or
        i32.eqz
        if
         local.get $3
         local.get $16
         i32.add
         local.tee $2
         local.get $13
         i32.add
         local.get $19
         i32.add
         i32.const 2
         i32.shl
         local.set $10
         global.get $~lib/memory/__stack_pointer
         local.get $23
         i32.store $0
         local.get $23
         local.get $3
         local.get $9
         i32.add
         i32.const 1
         i32.shl
         local.tee $14
         call $~lib/typedarray/Int16Array#__get
         local.get $2
         i32.add
         local.set $2
         global.get $~lib/memory/__stack_pointer
         local.get $23
         i32.store $0
         local.get $24
         local.get $23
         local.get $14
         i32.const 1
         i32.add
         call $~lib/typedarray/Int16Array#__get
         local.get $4
         local.get $25
         i32.add
         i32.add
         local.tee $14
         i32.const 0
         local.get $14
         i32.const 0
         i32.ge_s
         select
         local.get $14
         local.get $24
         i32.gt_s
         select
         local.get $1
         i32.mul
         local.get $6
         local.get $2
         i32.const 0
         local.get $2
         i32.const 0
         i32.ge_s
         select
         local.get $2
         local.get $6
         i32.gt_s
         select
         i32.add
         i32.const 2
         i32.shl
         local.set $2
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         global.get $~lib/memory/__stack_pointer
         local.get $21
         i32.store $0 offset=8
         local.get $0
         local.get $10
         local.get $21
         local.get $2
         call $~lib/typedarray/Uint8ClampedArray#__get
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         global.get $~lib/memory/__stack_pointer
         local.get $21
         i32.store $0 offset=8
         local.get $0
         local.get $10
         i32.const 1
         i32.add
         local.get $21
         local.get $2
         i32.const 1
         i32.add
         call $~lib/typedarray/Uint8ClampedArray#__get
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         global.get $~lib/memory/__stack_pointer
         local.get $21
         i32.store $0 offset=8
         local.get $0
         local.get $10
         i32.const 2
         i32.add
         local.get $21
         local.get $2
         i32.const 2
         i32.add
         call $~lib/typedarray/Uint8ClampedArray#__get
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         global.get $~lib/memory/__stack_pointer
         local.get $21
         i32.store $0 offset=8
         local.get $0
         local.get $10
         i32.const 3
         i32.add
         local.get $21
         local.get $2
         i32.const 3
         i32.add
         call $~lib/typedarray/Uint8ClampedArray#__get
         call $~lib/typedarray/Uint8ClampedArray#__set
        end
        local.get $15
        i32.const 4
        i32.add
        local.set $15
        local.get $3
        i32.const 1
        i32.add
        local.set $3
        br $for-loop|4
       end
      end
     end
    else
     i32.const 0
     local.set $3
     i32.const 0
     local.set $4
     i32.const 0
     local.set $13
     i32.const 0
     local.set $9
     i32.const 0
     local.set $15
     loop $for-loop|2
      local.get $15
      local.get $18
      i32.lt_s
      if
       local.get $3
       local.get $17
       i32.ge_s
       if
        local.get $4
        i32.const 1
        i32.add
        local.set $4
        local.get $1
        local.get $13
        i32.add
        local.set $13
        local.get $5
        local.get $9
        i32.add
        local.set $9
        i32.const 0
        local.set $3
       end
       block $for-continue|2
        local.get $4
        local.get $27
        i32.lt_s
        local.get $4
        local.get $29
        i32.gt_s
        i32.or
        local.get $3
        local.get $20
        i32.lt_s
        i32.or
        local.get $3
        local.get $28
        i32.gt_s
        i32.or
        br_if $for-continue|2
        local.get $3
        local.get $16
        i32.add
        local.tee $2
        local.get $13
        i32.add
        local.get $19
        i32.add
        i32.const 2
        i32.shl
        local.set $10
        global.get $~lib/memory/__stack_pointer
        local.get $23
        i32.store $0
        local.get $23
        local.get $3
        local.get $9
        i32.add
        i32.const 1
        i32.shl
        local.tee $14
        call $~lib/typedarray/Int16Array#__get
        local.get $2
        i32.add
        local.set $2
        global.get $~lib/memory/__stack_pointer
        local.get $23
        i32.store $0
        local.get $23
        local.get $14
        i32.const 1
        i32.add
        call $~lib/typedarray/Int16Array#__get
        local.get $4
        local.get $25
        i32.add
        i32.add
        local.tee $14
        i32.const 0
        i32.lt_s
        local.get $14
        local.get $24
        i32.gt_s
        i32.or
        local.get $2
        local.get $6
        i32.gt_s
        i32.or
        local.get $2
        i32.const 0
        i32.lt_s
        i32.or
        br_if $for-continue|2
        global.get $~lib/memory/__stack_pointer
        local.tee $22
        local.get $0
        i32.store $0
        local.get $22
        local.get $21
        i32.store $0 offset=8
        local.get $0
        local.get $10
        local.get $21
        local.get $2
        local.get $1
        local.get $14
        i32.mul
        i32.add
        i32.const 2
        i32.shl
        local.tee $2
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $21
        i32.store $0 offset=8
        local.get $0
        local.get $10
        i32.const 1
        i32.add
        local.get $21
        local.get $2
        i32.const 1
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $21
        i32.store $0 offset=8
        local.get $0
        local.get $10
        i32.const 2
        i32.add
        local.get $21
        local.get $2
        i32.const 2
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
        global.get $~lib/memory/__stack_pointer
        local.get $0
        i32.store $0
        global.get $~lib/memory/__stack_pointer
        local.get $21
        i32.store $0 offset=8
        local.get $0
        local.get $10
        i32.const 3
        i32.add
        local.get $21
        local.get $2
        i32.const 3
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        call $~lib/typedarray/Uint8ClampedArray#__set
       end
       local.get $15
       i32.const 4
       i32.add
       local.set $15
       local.get $3
       i32.const 1
       i32.add
       local.set $3
       br $for-loop|2
      end
     end
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 34560
  i32.const 34608
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $export:src/asm/displacementmapfilter/displacementmapfilter (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (param $7 f32) (param $8 f32) (param $9 i32) (param $10 i32) (param $11 f32) (param $12 f32) (param $13 i32) (result i32)
  (local $14 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1772
  i32.lt_s
  if
   i32.const 34560
   i32.const 34608
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $14
  local.get $0
  i32.store $0
  local.get $14
  local.get $4
  i32.store $0 offset=4
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  local.get $4
  local.get $5
  local.get $6
  local.get $7
  local.get $8
  local.get $9
  local.get $10
  local.get $11
  local.get $12
  local.get $13
  call $src/asm/displacementmapfilter/displacementmapfilter
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
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
