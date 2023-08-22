(module
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $none_=>_none (func))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_i32_i32_i32_i32_f32_=>_i32 (func (param i32 i32 i32 i32 i32 f32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i64_=>_none (func (param i32 i32 i64)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_i32_=>_f32 (func (param i32 i32) (result f32)))
 (type $i32_i32_i32_i32_i32_i32_i32_f32_f32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32 i32 i32 f32 f32 i32 i32) (result i32)))
 (type $i32_i32_i32_i32_i32_i32_i32_i32_f32_f32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32 i32 i32 i32 f32 f32 i32 i32) (result i32)))
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
 (global $~lib/rt/__rtti_base i32 (i32.const 2016))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 34816))
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
 (data $11 (i32.const 1622) "\f0?t\85\15\d3\b0\d9\ef?\0f\89\f9lX\b5\ef?Q[\12\d0\01\93\ef?{Q}<\b8r\ef?\aa\b9h1\87T\ef?8bunz8\ef?\e1\de\1f\f5\9d\1e\ef?\15\b71\n\fe\06\ef?\cb\a9:7\a7\f1\ee?\"4\12L\a6\de\ee?-\89a`\08\ce\ee?\'*6\d5\da\bf\ee?\82O\9dV+\b4\ee?)TH\dd\07\ab\ee?\85U:\b0~\a4\ee?\cd;\7ff\9e\a0\ee?t_\ec\e8u\9f\ee?\87\01\ebs\14\a1\ee?\13\ceL\99\89\a5\ee?\db\a0*B\e5\ac\ee?\e5\c5\cd\b07\b7\ee?\90\f0\a3\82\91\c4\ee?]%>\b2\03\d5\ee?\ad\d3Z\99\9f\e8\ee?G^\fb\f2v\ff\ee?\9cR\85\dd\9b\19\ef?i\90\ef\dc 7\ef?\87\a4\fb\dc\18X\ef?_\9b{3\97|\ef?\da\90\a4\a2\af\a4\ef?@En[v\d0\ef?")
 (data $12 (i32.const 1884) "<")
 (data $12.1 (i32.const 1896) "\02\00\00\00*\00\00\00O\00b\00j\00e\00c\00t\00 \00a\00l\00r\00e\00a\00d\00y\00 \00p\00i\00n\00n\00e\00d")
 (data $13 (i32.const 1948) "<")
 (data $13.1 (i32.const 1960) "\02\00\00\00(\00\00\00O\00b\00j\00e\00c\00t\00 \00i\00s\00 \00n\00o\00t\00 \00p\00i\00n\00n\00e\00d")
 (data $14 (i32.const 2016) "\07\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00A\00\00\00\01\19\00\00\81\08")
 (export "__new" (func $~lib/rt/itcms/__new))
 (export "__pin" (func $~lib/rt/itcms/__pin))
 (export "__unpin" (func $~lib/rt/itcms/__unpin))
 (export "__collect" (func $~lib/rt/itcms/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "memory" (memory $0))
 (export "__setArgumentsLength" (func $~setArgumentsLength))
 (export "convolutionmatrixfilter" (func $export:src/asm/convolutionmatrixfilter/convolutionmatrixfilter@varargs))
 (export "weighted" (func $export:src/asm/convolutionmatrixfilter/weighted))
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
  i32.const 1904
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1968
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
   i32.const 34816
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
   i32.const 2016
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
   i32.const 2020
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
  i32.const 34816
  i32.const 0
  i32.store $0
  i32.const 36384
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
    i32.const 34816
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
      i32.const 34816
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
  i32.const 34816
  i32.const 36388
  memory.size $0
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  i32.const 34816
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
      i32.const 34816
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
    i32.const 34816
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
     i32.const 34816
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
    i32.const 1904
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
   i32.const 1968
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
       br_table $~lib/object/Object $~lib/arraybuffer/ArrayBuffer $~lib/string/String $folding-inner0 $folding-inner0 $folding-inner0 $folding-inner0 $invalid
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
  i32.const 34816
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
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
 (func $~lib/typedarray/Uint8ClampedArray#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $1
  i64.const 0
  i64.store $0
  local.get $1
  i32.const 12
  i32.const 4
  call $~lib/rt/itcms/__new
  local.tee $1
  i32.store $0
  global.get $~lib/memory/__stack_pointer
  local.tee $2
  local.get $1
  i32.store $0 offset=4
  local.get $2
  local.get $1
  local.get $0
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.tee $0
  i32.store $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/typedarray/Int16Array#get:length (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
  i32.const 1
  i32.shr_u
  local.set $0
  local.get $1
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/typedarray/Int16Array#constructor (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $1
  i64.const 0
  i64.store $0
  local.get $1
  i32.const 12
  i32.const 6
  call $~lib/rt/itcms/__new
  local.tee $1
  i32.store $0
  global.get $~lib/memory/__stack_pointer
  local.tee $2
  local.get $1
  i32.store $0 offset=4
  local.get $2
  local.get $1
  local.get $0
  i32.const 1
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.tee $0
  i32.store $0
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $0
 )
 (func $~lib/typedarray/Int16Array#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
 (func $~lib/typedarray/Int16Array#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
 (func $~lib/typedarray/Float32Array#get:length (param $0 i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
  i32.const 2
  i32.shr_u
  local.set $0
  local.get $1
  i32.const 4
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
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
 (func $~lib/typedarray/Uint8ClampedArray#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
 (func $~lib/typedarray/Uint8ClampedArray#__set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
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
 (func $src/asm/convolutionmatrixfilter/convolutionmatrixfilter (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (param $7 f32) (param $8 f32) (param $9 i32) (param $10 i32) (result i32)
  (local $11 f32)
  (local $12 f32)
  (local $13 f32)
  (local $14 f32)
  (local $15 f32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 f32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (local $28 i32)
  (local $29 f32)
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $17
  i32.const 0
  i32.const 20
  memory.fill $0
  local.get $17
  local.get $0
  i32.store $0
  local.get $0
  call $~lib/typedarray/Uint8ClampedArray#get:length
  local.set $21
  global.get $~lib/memory/__stack_pointer
  local.get $21
  call $~lib/typedarray/Uint8ClampedArray#constructor
  local.tee $20
  i32.store $0 offset=4
  local.get $1
  i32.const 1
  i32.sub
  local.set $17
  local.get $21
  i32.const 2
  i32.shr_u
  local.get $1
  i32.sub
  local.set $18
  local.get $2
  i32.const 9
  i32.eq
  if
   local.get $10
   i32.const 1
   i32.eq
   if
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store $0
    local.get $5
    call $~lib/typedarray/Int16Array#get:length
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $2
    call $~lib/typedarray/Int16Array#constructor
    local.tee $22
    i32.store $0 offset=8
    i32.const 0
    local.set $10
    loop $for-loop|0
     local.get $2
     local.get $10
     i32.gt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.tee $23
      local.get $22
      i32.store $0
      local.get $23
      local.get $5
      i32.store $0 offset=12
      local.get $22
      local.get $10
      local.get $5
      local.get $10
      call $~lib/typedarray/Int16Array#__get
      call $~lib/typedarray/Int16Array#__set
      global.get $~lib/memory/__stack_pointer
      local.get $22
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $5
      i32.store $0 offset=12
      local.get $22
      local.get $10
      i32.const 1
      i32.add
      local.tee $23
      local.get $5
      local.get $23
      call $~lib/typedarray/Int16Array#__get
      local.get $1
      i32.mul
      call $~lib/typedarray/Int16Array#__set
      local.get $10
      i32.const 2
      i32.add
      local.set $10
      br $for-loop|0
     end
    end
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store $0
    local.get $3
    call $~lib/typedarray/Float32Array#get:length
    local.set $23
    global.get $~lib/memory/__stack_pointer
    local.get $6
    i32.store $0
    local.get $6
    call $~lib/typedarray/Int16Array#get:length
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $2
    call $~lib/typedarray/Int16Array#constructor
    local.tee $24
    i32.store $0 offset=16
    i32.const 0
    local.set $10
    loop $for-loop|1
     local.get $2
     local.get $10
     i32.gt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.tee $5
      local.get $24
      i32.store $0
      local.get $5
      local.get $6
      i32.store $0 offset=12
      local.get $24
      local.get $10
      local.get $6
      local.get $10
      call $~lib/typedarray/Int16Array#__get
      call $~lib/typedarray/Int16Array#__set
      global.get $~lib/memory/__stack_pointer
      local.get $24
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $6
      i32.store $0 offset=12
      local.get $24
      local.get $10
      i32.const 1
      i32.add
      local.tee $5
      local.get $6
      local.get $5
      call $~lib/typedarray/Int16Array#__get
      local.get $1
      i32.mul
      call $~lib/typedarray/Int16Array#__set
      local.get $10
      i32.const 2
      i32.add
      local.set $10
      br $for-loop|1
     end
    end
    i32.const 0
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store $0
    local.get $4
    call $~lib/typedarray/Float32Array#get:length
    local.tee $25
    local.get $23
    local.get $23
    local.get $25
    i32.lt_s
    select
    local.set $26
    i32.const 0
    local.set $6
    loop $for-loop|4
     local.get $6
     local.get $21
     i32.lt_s
     if
      local.get $1
      local.get $2
      i32.le_s
      if
       local.get $1
       local.get $16
       i32.add
       local.set $16
       i32.const 0
       local.set $2
      end
      f32.const 0
      local.set $13
      f32.const 0
      local.set $11
      i32.const 0
      local.set $10
      i32.const 0
      local.set $5
      loop $for-loop|5
       local.get $10
       local.get $26
       i32.lt_s
       if
        local.get $10
        local.get $23
        i32.lt_s
        if
         global.get $~lib/memory/__stack_pointer
         local.get $22
         i32.store $0
         local.get $22
         local.get $5
         call $~lib/typedarray/Int16Array#__get
         local.get $2
         i32.add
         local.set $27
         global.get $~lib/memory/__stack_pointer
         local.get $22
         i32.store $0
         local.get $17
         local.get $27
         i32.ge_s
         local.get $27
         i32.const 0
         i32.ge_s
         i32.and
         local.get $22
         local.get $5
         i32.const 1
         i32.add
         call $~lib/typedarray/Int16Array#__get
         local.get $16
         i32.add
         local.tee $28
         i32.const 0
         i32.ge_s
         i32.and
         local.get $18
         local.get $28
         i32.ge_s
         i32.and
         if
          global.get $~lib/memory/__stack_pointer
          local.get $3
          i32.store $0
          local.get $3
          local.get $10
          call $~lib/typedarray/Float32Array#__get
          local.set $12
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $11
          local.get $0
          local.get $27
          local.get $28
          i32.add
          i32.const 2
          i32.shl
          call $~lib/typedarray/Uint8ClampedArray#__get
          f32.convert_i32_u
          local.get $12
          f32.mul
          f32.add
          local.set $11
         end
        end
        local.get $10
        local.get $25
        i32.lt_s
        if
         global.get $~lib/memory/__stack_pointer
         local.get $24
         i32.store $0
         local.get $24
         local.get $5
         call $~lib/typedarray/Int16Array#__get
         local.get $2
         i32.add
         local.set $27
         global.get $~lib/memory/__stack_pointer
         local.get $24
         i32.store $0
         local.get $17
         local.get $27
         i32.ge_s
         local.get $27
         i32.const 0
         i32.ge_s
         i32.and
         local.get $24
         local.get $5
         i32.const 1
         i32.add
         call $~lib/typedarray/Int16Array#__get
         local.get $16
         i32.add
         local.tee $28
         i32.const 0
         i32.ge_s
         i32.and
         local.get $18
         local.get $28
         i32.ge_s
         i32.and
         if
          global.get $~lib/memory/__stack_pointer
          local.get $4
          i32.store $0
          local.get $4
          local.get $10
          call $~lib/typedarray/Float32Array#__get
          local.set $12
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $13
          local.get $0
          local.get $27
          local.get $28
          i32.add
          i32.const 2
          i32.shl
          call $~lib/typedarray/Uint8ClampedArray#__get
          f32.convert_i32_u
          local.get $12
          f32.mul
          f32.add
          local.set $13
         end
        end
        local.get $10
        i32.const 1
        i32.add
        local.set $10
        local.get $5
        i32.const 2
        i32.add
        local.set $5
        br $for-loop|5
       end
      end
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      f32.const 0
      f32.const 255
      local.get $9
      i32.const 1
      i32.eq
      if (result f32)
       local.get $11
       f32.abs
       local.tee $11
       local.get $13
       f32.abs
       local.tee $12
       f32.max
       local.tee $13
       f32.const 0
       f32.gt
       if (result f32)
        local.get $13
        local.get $11
        local.get $12
        f32.min
        local.tee $11
        f32.const 0.4300000071525574
        f32.mul
        local.get $13
        f32.div
        local.get $11
        f32.mul
        local.get $13
        f32.div
        f32.const 1
        f32.add
        f32.mul
       else
        f32.const 0
       end
      else
       local.get $7
       local.get $11
       f32.mul
       local.get $8
       local.get $13
       f32.mul
       f32.add
      end
      local.tee $11
      local.get $11
      f32.const 255
      f32.gt
      select
      local.get $11
      f32.const 0
      f32.lt
      select
      i32.trunc_sat_f32_u
      i32.const 255
      i32.and
      local.tee $5
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      i32.const 1
      i32.add
      local.get $5
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      i32.const 2
      i32.add
      local.get $5
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0 offset=12
      local.get $20
      local.get $6
      i32.const 3
      i32.add
      local.tee $5
      local.get $0
      local.get $5
      call $~lib/typedarray/Uint8ClampedArray#__get
      call $~lib/typedarray/Uint8ClampedArray#__set
      local.get $6
      i32.const 4
      i32.add
      local.set $6
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|4
     end
    end
   else
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store $0
    local.get $5
    call $~lib/typedarray/Int16Array#get:length
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $2
    call $~lib/typedarray/Int16Array#constructor
    local.tee $4
    i32.store $0 offset=8
    i32.const 0
    local.set $10
    loop $for-loop|6
     local.get $2
     local.get $10
     i32.gt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.tee $6
      local.get $4
      i32.store $0
      local.get $6
      local.get $5
      i32.store $0 offset=12
      local.get $4
      local.get $10
      local.get $5
      local.get $10
      call $~lib/typedarray/Int16Array#__get
      call $~lib/typedarray/Int16Array#__set
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $5
      i32.store $0 offset=12
      local.get $4
      local.get $10
      i32.const 1
      i32.add
      local.tee $6
      local.get $5
      local.get $6
      call $~lib/typedarray/Int16Array#__get
      local.get $1
      i32.mul
      call $~lib/typedarray/Int16Array#__set
      local.get $10
      i32.const 2
      i32.add
      local.set $10
      br $for-loop|6
     end
    end
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store $0
    local.get $3
    call $~lib/typedarray/Float32Array#get:length
    local.set $9
    i32.const 0
    local.set $2
    i32.const 0
    local.set $6
    loop $for-loop|9
     local.get $6
     local.get $21
     i32.lt_s
     if
      local.get $1
      local.get $2
      i32.le_s
      if
       local.get $1
       local.get $16
       i32.add
       local.set $16
       i32.const 0
       local.set $2
      end
      f32.const 0
      local.set $11
      i32.const 0
      local.set $10
      i32.const 0
      local.set $5
      loop $for-loop|10
       local.get $9
       local.get $10
       i32.gt_s
       if
        global.get $~lib/memory/__stack_pointer
        local.get $4
        i32.store $0
        local.get $4
        local.get $5
        call $~lib/typedarray/Int16Array#__get
        local.get $2
        i32.add
        local.set $22
        global.get $~lib/memory/__stack_pointer
        local.get $4
        i32.store $0
        local.get $22
        i32.const 0
        i32.lt_s
        local.get $17
        local.get $22
        i32.lt_s
        i32.or
        local.get $4
        local.get $5
        i32.const 1
        i32.add
        call $~lib/typedarray/Int16Array#__get
        local.get $16
        i32.add
        local.tee $23
        i32.const 0
        i32.lt_s
        i32.or
        local.get $18
        local.get $23
        i32.lt_s
        i32.or
        i32.eqz
        if
         global.get $~lib/memory/__stack_pointer
         local.get $3
         i32.store $0
         local.get $3
         local.get $10
         call $~lib/typedarray/Float32Array#__get
         local.set $12
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         local.get $11
         local.get $0
         local.get $22
         local.get $23
         i32.add
         i32.const 2
         i32.shl
         call $~lib/typedarray/Uint8ClampedArray#__get
         f32.convert_i32_u
         local.get $12
         f32.mul
         f32.add
         local.set $11
        end
        local.get $10
        i32.const 1
        i32.add
        local.set $10
        local.get $5
        i32.const 2
        i32.add
        local.set $5
        br $for-loop|10
       end
      end
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      f32.const 0
      f32.const 255
      local.get $7
      local.get $11
      f32.mul
      local.get $8
      f32.add
      local.tee $11
      local.get $11
      f32.const 255
      f32.gt
      select
      local.get $11
      f32.const 0
      f32.lt
      select
      i32.trunc_sat_f32_u
      i32.const 255
      i32.and
      local.tee $5
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      i32.const 1
      i32.add
      local.get $5
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      i32.const 2
      i32.add
      local.get $5
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0 offset=12
      local.get $20
      local.get $6
      i32.const 3
      i32.add
      local.tee $5
      local.get $0
      local.get $5
      call $~lib/typedarray/Uint8ClampedArray#__get
      call $~lib/typedarray/Uint8ClampedArray#__set
      local.get $6
      i32.const 4
      i32.add
      local.set $6
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|9
     end
    end
   end
  else
   local.get $10
   i32.const 1
   i32.eq
   if
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store $0
    local.get $5
    call $~lib/typedarray/Int16Array#get:length
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $2
    call $~lib/typedarray/Int16Array#constructor
    local.tee $22
    i32.store $0 offset=8
    i32.const 0
    local.set $10
    loop $for-loop|11
     local.get $2
     local.get $10
     i32.gt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.tee $23
      local.get $22
      i32.store $0
      local.get $23
      local.get $5
      i32.store $0 offset=12
      local.get $22
      local.get $10
      local.get $5
      local.get $10
      call $~lib/typedarray/Int16Array#__get
      call $~lib/typedarray/Int16Array#__set
      global.get $~lib/memory/__stack_pointer
      local.get $22
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $5
      i32.store $0 offset=12
      local.get $22
      local.get $10
      i32.const 1
      i32.add
      local.tee $23
      local.get $5
      local.get $23
      call $~lib/typedarray/Int16Array#__get
      local.get $1
      i32.mul
      call $~lib/typedarray/Int16Array#__set
      local.get $10
      i32.const 2
      i32.add
      local.set $10
      br $for-loop|11
     end
    end
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store $0
    local.get $3
    call $~lib/typedarray/Float32Array#get:length
    local.set $23
    global.get $~lib/memory/__stack_pointer
    local.get $6
    i32.store $0
    local.get $6
    call $~lib/typedarray/Int16Array#get:length
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $2
    call $~lib/typedarray/Int16Array#constructor
    local.tee $24
    i32.store $0 offset=16
    i32.const 0
    local.set $10
    loop $for-loop|12
     local.get $2
     local.get $10
     i32.gt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.tee $5
      local.get $24
      i32.store $0
      local.get $5
      local.get $6
      i32.store $0 offset=12
      local.get $24
      local.get $10
      local.get $6
      local.get $10
      call $~lib/typedarray/Int16Array#__get
      call $~lib/typedarray/Int16Array#__set
      global.get $~lib/memory/__stack_pointer
      local.get $24
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $6
      i32.store $0 offset=12
      local.get $24
      local.get $10
      i32.const 1
      i32.add
      local.tee $5
      local.get $6
      local.get $5
      call $~lib/typedarray/Int16Array#__get
      local.get $1
      i32.mul
      call $~lib/typedarray/Int16Array#__set
      local.get $10
      i32.const 2
      i32.add
      local.set $10
      br $for-loop|12
     end
    end
    i32.const 0
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $4
    i32.store $0
    local.get $4
    call $~lib/typedarray/Float32Array#get:length
    local.tee $25
    local.get $23
    local.get $23
    local.get $25
    i32.lt_s
    select
    local.set $26
    i32.const 0
    local.set $6
    loop $for-loop|13
     local.get $6
     local.get $21
     i32.lt_s
     if
      local.get $1
      local.get $2
      i32.le_s
      if
       local.get $1
       local.get $16
       i32.add
       local.set $16
       i32.const 0
       local.set $2
      end
      f32.const 0
      local.set $14
      f32.const 0
      local.set $19
      f32.const 0
      local.set $13
      f32.const 0
      local.set $12
      f32.const 0
      local.set $15
      f32.const 0
      local.set $11
      i32.const 0
      local.set $10
      i32.const 0
      local.set $5
      loop $for-loop|14
       local.get $10
       local.get $26
       i32.lt_s
       if
        local.get $10
        local.get $23
        i32.lt_s
        if
         global.get $~lib/memory/__stack_pointer
         local.get $22
         i32.store $0
         local.get $22
         local.get $5
         call $~lib/typedarray/Int16Array#__get
         local.get $2
         i32.add
         local.set $27
         global.get $~lib/memory/__stack_pointer
         local.get $22
         i32.store $0
         local.get $17
         local.get $27
         i32.ge_s
         local.get $27
         i32.const 0
         i32.ge_s
         i32.and
         local.get $22
         local.get $5
         i32.const 1
         i32.add
         call $~lib/typedarray/Int16Array#__get
         local.get $16
         i32.add
         local.tee $28
         i32.const 0
         i32.ge_s
         i32.and
         local.get $18
         local.get $28
         i32.ge_s
         i32.and
         if
          global.get $~lib/memory/__stack_pointer
          local.get $3
          i32.store $0
          local.get $3
          local.get $10
          call $~lib/typedarray/Float32Array#__get
          local.set $29
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $11
          local.get $0
          local.get $27
          local.get $28
          i32.add
          i32.const 2
          i32.shl
          local.tee $27
          call $~lib/typedarray/Uint8ClampedArray#__get
          f32.convert_i32_u
          local.get $29
          f32.mul
          f32.add
          local.set $11
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $15
          local.get $0
          local.get $27
          i32.const 1
          i32.add
          call $~lib/typedarray/Uint8ClampedArray#__get
          f32.convert_i32_u
          local.get $29
          f32.mul
          f32.add
          local.set $15
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $12
          local.get $0
          local.get $27
          i32.const 2
          i32.add
          call $~lib/typedarray/Uint8ClampedArray#__get
          f32.convert_i32_u
          local.get $29
          f32.mul
          f32.add
          local.set $12
         end
        end
        local.get $10
        local.get $25
        i32.lt_s
        if
         global.get $~lib/memory/__stack_pointer
         local.get $24
         i32.store $0
         local.get $24
         local.get $5
         call $~lib/typedarray/Int16Array#__get
         local.get $2
         i32.add
         local.set $27
         global.get $~lib/memory/__stack_pointer
         local.get $24
         i32.store $0
         local.get $17
         local.get $27
         i32.ge_s
         local.get $27
         i32.const 0
         i32.ge_s
         i32.and
         local.get $24
         local.get $5
         i32.const 1
         i32.add
         call $~lib/typedarray/Int16Array#__get
         local.get $16
         i32.add
         local.tee $28
         i32.const 0
         i32.ge_s
         i32.and
         local.get $18
         local.get $28
         i32.ge_s
         i32.and
         if
          global.get $~lib/memory/__stack_pointer
          local.get $4
          i32.store $0
          local.get $4
          local.get $10
          call $~lib/typedarray/Float32Array#__get
          local.set $29
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $13
          local.get $0
          local.get $27
          local.get $28
          i32.add
          i32.const 2
          i32.shl
          local.tee $27
          call $~lib/typedarray/Uint8ClampedArray#__get
          f32.convert_i32_u
          local.get $29
          f32.mul
          f32.add
          local.set $13
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $19
          local.get $0
          local.get $27
          i32.const 1
          i32.add
          call $~lib/typedarray/Uint8ClampedArray#__get
          f32.convert_i32_u
          local.get $29
          f32.mul
          f32.add
          local.set $19
          global.get $~lib/memory/__stack_pointer
          local.get $0
          i32.store $0
          local.get $14
          local.get $0
          local.get $27
          i32.const 2
          i32.add
          call $~lib/typedarray/Uint8ClampedArray#__get
          f32.convert_i32_u
          local.get $29
          f32.mul
          f32.add
          local.set $14
         end
        end
        local.get $10
        i32.const 1
        i32.add
        local.set $10
        local.get $5
        i32.const 2
        i32.add
        local.set $5
        br $for-loop|14
       end
      end
      local.get $9
      i32.const 1
      i32.eq
      if (result f32)
       local.get $13
       f32.abs
       local.tee $13
       local.get $11
       f32.abs
       local.tee $11
       f32.max
       local.tee $29
       f32.const 0
       f32.gt
       if (result f32)
        local.get $29
        local.get $11
        local.get $13
        f32.min
        local.tee $11
        f32.const 0.4300000071525574
        f32.mul
        local.get $29
        f32.div
        local.get $11
        f32.mul
        local.get $29
        f32.div
        f32.const 1
        f32.add
        f32.mul
       else
        f32.const 0
       end
       local.set $11
       local.get $15
       f32.abs
       local.tee $13
       local.get $19
       f32.abs
       local.tee $15
       f32.max
       local.tee $19
       f32.const 0
       f32.gt
       if (result f32)
        local.get $19
        local.get $13
        local.get $15
        f32.min
        local.tee $13
        f32.const 0.4300000071525574
        f32.mul
        local.get $19
        f32.div
        local.get $13
        f32.mul
        local.get $19
        f32.div
        f32.const 1
        f32.add
        f32.mul
       else
        f32.const 0
       end
       local.set $13
       local.get $12
       f32.abs
       local.tee $12
       local.get $14
       f32.abs
       local.tee $14
       f32.max
       local.tee $15
       f32.const 0
       f32.gt
       if (result f32)
        local.get $15
        local.get $12
        local.get $14
        f32.min
        local.tee $12
        f32.const 0.4300000071525574
        f32.mul
        local.get $15
        f32.div
        local.get $12
        f32.mul
        local.get $15
        f32.div
        f32.const 1
        f32.add
        f32.mul
       else
        f32.const 0
       end
      else
       local.get $7
       local.get $11
       f32.mul
       local.get $8
       local.get $13
       f32.mul
       f32.add
       local.set $11
       local.get $7
       local.get $15
       f32.mul
       local.get $8
       local.get $19
       f32.mul
       f32.add
       local.set $13
       local.get $7
       local.get $12
       f32.mul
       local.get $8
       local.get $14
       f32.mul
       f32.add
      end
      local.set $12
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      f32.const 0
      f32.const 255
      local.get $11
      local.get $11
      f32.const 255
      f32.gt
      select
      local.get $11
      f32.const 0
      f32.lt
      select
      i32.trunc_sat_f32_u
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      i32.const 1
      i32.add
      f32.const 0
      f32.const 255
      local.get $13
      local.get $13
      f32.const 255
      f32.gt
      select
      local.get $13
      f32.const 0
      f32.lt
      select
      i32.trunc_sat_f32_u
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      i32.const 2
      i32.add
      f32.const 0
      f32.const 255
      local.get $12
      local.get $12
      f32.const 255
      f32.gt
      select
      local.get $12
      f32.const 0
      f32.lt
      select
      i32.trunc_sat_f32_u
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0 offset=12
      local.get $20
      local.get $6
      i32.const 3
      i32.add
      local.tee $5
      local.get $0
      local.get $5
      call $~lib/typedarray/Uint8ClampedArray#__get
      call $~lib/typedarray/Uint8ClampedArray#__set
      local.get $6
      i32.const 4
      i32.add
      local.set $6
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|13
     end
    end
   else
    global.get $~lib/memory/__stack_pointer
    local.get $5
    i32.store $0
    local.get $5
    call $~lib/typedarray/Int16Array#get:length
    local.set $2
    global.get $~lib/memory/__stack_pointer
    local.get $2
    call $~lib/typedarray/Int16Array#constructor
    local.tee $4
    i32.store $0 offset=8
    i32.const 0
    local.set $10
    loop $for-loop|15
     local.get $2
     local.get $10
     i32.gt_s
     if
      global.get $~lib/memory/__stack_pointer
      local.tee $6
      local.get $4
      i32.store $0
      local.get $6
      local.get $5
      i32.store $0 offset=12
      local.get $4
      local.get $10
      local.get $5
      local.get $10
      call $~lib/typedarray/Int16Array#__get
      call $~lib/typedarray/Int16Array#__set
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $5
      i32.store $0 offset=12
      local.get $4
      local.get $10
      i32.const 1
      i32.add
      local.tee $6
      local.get $5
      local.get $6
      call $~lib/typedarray/Int16Array#__get
      local.get $1
      i32.mul
      call $~lib/typedarray/Int16Array#__set
      local.get $10
      i32.const 2
      i32.add
      local.set $10
      br $for-loop|15
     end
    end
    global.get $~lib/memory/__stack_pointer
    local.get $3
    i32.store $0
    local.get $3
    call $~lib/typedarray/Float32Array#get:length
    local.set $9
    i32.const 0
    local.set $2
    i32.const 0
    local.set $6
    loop $for-loop|16
     local.get $6
     local.get $21
     i32.lt_s
     if
      local.get $1
      local.get $2
      i32.le_s
      if
       local.get $1
       local.get $16
       i32.add
       local.set $16
       i32.const 0
       local.set $2
      end
      f32.const 0
      local.set $12
      f32.const 0
      local.set $15
      f32.const 0
      local.set $11
      i32.const 0
      local.set $10
      i32.const 0
      local.set $5
      loop $for-loop|17
       local.get $9
       local.get $10
       i32.gt_s
       if
        global.get $~lib/memory/__stack_pointer
        local.get $4
        i32.store $0
        local.get $4
        local.get $5
        call $~lib/typedarray/Int16Array#__get
        local.get $2
        i32.add
        local.set $22
        global.get $~lib/memory/__stack_pointer
        local.get $4
        i32.store $0
        local.get $22
        i32.const 0
        i32.lt_s
        local.get $17
        local.get $22
        i32.lt_s
        i32.or
        local.get $4
        local.get $5
        i32.const 1
        i32.add
        call $~lib/typedarray/Int16Array#__get
        local.get $16
        i32.add
        local.tee $23
        i32.const 0
        i32.lt_s
        i32.or
        local.get $18
        local.get $23
        i32.lt_s
        i32.or
        i32.eqz
        if
         global.get $~lib/memory/__stack_pointer
         local.get $3
         i32.store $0
         local.get $3
         local.get $10
         call $~lib/typedarray/Float32Array#__get
         local.set $13
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         local.get $11
         local.get $0
         local.get $22
         local.get $23
         i32.add
         i32.const 2
         i32.shl
         local.tee $22
         call $~lib/typedarray/Uint8ClampedArray#__get
         f32.convert_i32_u
         local.get $13
         f32.mul
         f32.add
         local.set $11
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         local.get $15
         local.get $0
         local.get $22
         i32.const 1
         i32.add
         call $~lib/typedarray/Uint8ClampedArray#__get
         f32.convert_i32_u
         local.get $13
         f32.mul
         f32.add
         local.set $15
         global.get $~lib/memory/__stack_pointer
         local.get $0
         i32.store $0
         local.get $12
         local.get $0
         local.get $22
         i32.const 2
         i32.add
         call $~lib/typedarray/Uint8ClampedArray#__get
         f32.convert_i32_u
         local.get $13
         f32.mul
         f32.add
         local.set $12
        end
        local.get $10
        i32.const 1
        i32.add
        local.set $10
        local.get $5
        i32.const 2
        i32.add
        local.set $5
        br $for-loop|17
       end
      end
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      f32.const 0
      f32.const 255
      local.get $7
      local.get $11
      f32.mul
      local.get $8
      f32.add
      local.tee $11
      local.get $11
      f32.const 255
      f32.gt
      select
      local.get $11
      f32.const 0
      f32.lt
      select
      i32.trunc_sat_f32_u
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      i32.const 1
      i32.add
      f32.const 0
      f32.const 255
      local.get $7
      local.get $15
      f32.mul
      local.get $8
      f32.add
      local.tee $11
      local.get $11
      f32.const 255
      f32.gt
      select
      local.get $11
      f32.const 0
      f32.lt
      select
      i32.trunc_sat_f32_u
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      local.get $20
      local.get $6
      i32.const 2
      i32.add
      f32.const 0
      f32.const 255
      local.get $7
      local.get $12
      f32.mul
      local.get $8
      f32.add
      local.tee $11
      local.get $11
      f32.const 255
      f32.gt
      select
      local.get $11
      f32.const 0
      f32.lt
      select
      i32.trunc_sat_f32_u
      i32.const 255
      i32.and
      call $~lib/typedarray/Uint8ClampedArray#__set
      global.get $~lib/memory/__stack_pointer
      local.get $20
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      local.get $0
      i32.store $0 offset=12
      local.get $20
      local.get $6
      i32.const 3
      i32.add
      local.tee $5
      local.get $0
      local.get $5
      call $~lib/typedarray/Uint8ClampedArray#__get
      call $~lib/typedarray/Uint8ClampedArray#__set
      local.get $6
      i32.const 4
      i32.add
      local.set $6
      local.get $2
      i32.const 1
      i32.add
      local.set $2
      br $for-loop|16
     end
    end
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $20
 )
 (func $src/asm/convolutionmatrixfilter/weighted (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 f32) (result i32)
  (local $6 i32)
  (local $7 f32)
  (local $8 f32)
  (local $9 f32)
  (local $10 f32)
  (local $11 f64)
  (local $12 i32)
  (local $13 f32)
  (local $14 f64)
  (local $15 i32)
  (local $16 f32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i64)
  (local $21 f32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 f32)
  (local $28 f32)
  (local $29 f32)
  (local $30 i32)
  (local $31 i32)
  (local $32 f32)
  (local $33 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $6
  i64.const 0
  i64.store $0
  local.get $6
  i32.const 0
  i32.store $0 offset=8
  local.get $6
  local.get $0
  i32.store $0
  local.get $0
  call $~lib/typedarray/Uint8ClampedArray#get:length
  local.set $24
  global.get $~lib/memory/__stack_pointer
  local.get $24
  call $~lib/typedarray/Uint8ClampedArray#constructor
  local.tee $33
  i32.store $0 offset=4
  local.get $1
  i32.const 1
  i32.sub
  local.set $19
  local.get $2
  i32.const 1
  i32.sub
  local.set $18
  local.get $3
  i32.const 1
  i32.shr_u
  local.set $30
  local.get $3
  local.get $3
  i32.mul
  local.set $17
  i32.const 0
  local.set $3
  i32.const 0
  local.set $2
  loop $for-loop|0
   local.get $2
   local.get $24
   i32.lt_s
   if
    local.get $1
    local.get $3
    i32.le_s
    if (result i32)
     local.get $23
     i32.const 1
     i32.add
     local.set $23
     local.get $1
     local.get $22
     i32.add
     local.set $22
     i32.const 0
    else
     local.get $3
    end
    local.set $6
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store $0
    local.get $0
    local.get $2
    call $~lib/typedarray/Uint8ClampedArray#__get
    f32.convert_i32_u
    local.set $8
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store $0
    local.get $0
    local.get $2
    i32.const 1
    i32.add
    call $~lib/typedarray/Uint8ClampedArray#__get
    f32.convert_i32_u
    local.set $7
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store $0
    local.get $0
    local.get $2
    i32.const 2
    i32.add
    call $~lib/typedarray/Uint8ClampedArray#__get
    f32.convert_i32_u
    local.set $21
    f32.const 0
    local.set $32
    f32.const 0
    local.set $29
    f32.const 0
    local.set $28
    f32.const 0
    local.set $27
    i32.const 0
    local.get $30
    i32.sub
    local.tee $3
    local.set $26
    local.get $1
    local.get $3
    i32.mul
    local.set $25
    i32.const 0
    local.set $31
    loop $for-loop|1
     local.get $17
     local.get $31
     i32.gt_s
     if
      local.get $3
      local.get $30
      i32.gt_s
      if
       local.get $26
       i32.const 1
       i32.add
       local.set $26
       local.get $1
       local.get $25
       i32.add
       local.set $25
       i32.const 0
       local.get $30
       i32.sub
       local.set $3
      end
      local.get $3
      local.get $6
      i32.add
      local.tee $12
      i32.const 0
      i32.lt_s
      local.get $12
      local.get $19
      i32.gt_s
      i32.or
      local.get $23
      local.get $26
      i32.add
      local.tee $12
      i32.const 0
      i32.lt_s
      i32.or
      local.get $12
      local.get $18
      i32.gt_s
      i32.or
      if (result f32)
       local.get $8
       local.set $10
       local.get $7
       local.set $9
       local.get $21
      else
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $0
       local.get $3
       local.get $6
       i32.add
       local.get $22
       i32.add
       local.get $25
       i32.add
       i32.const 2
       i32.shl
       local.tee $12
       call $~lib/typedarray/Uint8ClampedArray#__get
       f32.convert_i32_u
       local.set $10
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $0
       local.get $12
       i32.const 1
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       f32.convert_i32_u
       local.set $9
       global.get $~lib/memory/__stack_pointer
       local.get $0
       i32.store $0
       local.get $0
       local.get $12
       i32.const 2
       i32.add
       call $~lib/typedarray/Uint8ClampedArray#__get
       f32.convert_i32_u
      end
      local.set $16
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store $0
      local.get $32
      local.get $4
      local.get $31
      call $~lib/typedarray/Float32Array#__get
      block $~lib/util/math/expf_lut|inlined.0 (result f32)
       local.get $5
       local.get $10
       local.get $8
       f32.sub
       local.tee $13
       local.get $13
       f32.mul
       local.get $9
       local.get $7
       f32.sub
       local.tee $13
       local.get $13
       f32.mul
       f32.add
       local.get $16
       local.get $21
       f32.sub
       local.tee $13
       local.get $13
       f32.mul
       f32.add
       f32.mul
       local.tee $13
       f64.promote_f32
       local.set $11
       local.get $13
       i32.reinterpret_f32
       local.tee $12
       i32.const 20
       i32.shr_u
       i32.const 2047
       i32.and
       local.tee $15
       i32.const 1067
       i32.ge_u
       if
        f32.const 0
        local.get $12
        i32.const -8388608
        i32.eq
        br_if $~lib/util/math/expf_lut|inlined.0
        drop
        local.get $13
        local.get $13
        f32.add
        local.get $15
        i32.const 2040
        i32.ge_u
        br_if $~lib/util/math/expf_lut|inlined.0
        drop
        local.get $13
        f32.const 1701411834604692317316873e14
        f32.mul
        local.get $13
        f32.const 88.72283172607422
        f32.gt
        br_if $~lib/util/math/expf_lut|inlined.0
        drop
        f32.const 0
        local.get $13
        f32.const -103.97207641601562
        f32.lt
        br_if $~lib/util/math/expf_lut|inlined.0
        drop
       end
       local.get $11
       f64.const 46.16624130844683
       f64.mul
       local.tee $14
       f64.const 6755399441055744
       f64.add
       local.tee $11
       i64.reinterpret_f64
       local.set $20
       local.get $14
       local.get $11
       f64.const -6755399441055744
       f64.add
       f64.sub
       local.tee $11
       f64.const 0.021660849396613134
       f64.mul
       f64.const 1
       f64.add
       local.get $11
       f64.const 1.6938359250920212e-06
       f64.mul
       f64.const 2.3459809789509004e-04
       f64.add
       local.get $11
       local.get $11
       f64.mul
       f64.mul
       f64.add
       local.get $20
       i32.wrap_i64
       i32.const 31
       i32.and
       i32.const 3
       i32.shl
       i32.const 1616
       i32.add
       i64.load $0
       local.get $20
       i64.const 47
       i64.shl
       i64.add
       f64.reinterpret_i64
       f64.mul
       f32.demote_f64
      end
      f32.mul
      local.tee $13
      f32.add
      local.set $32
      local.get $29
      local.get $13
      local.get $10
      f32.mul
      f32.add
      local.set $29
      local.get $28
      local.get $13
      local.get $9
      f32.mul
      f32.add
      local.set $28
      local.get $27
      local.get $13
      local.get $16
      f32.mul
      f32.add
      local.set $27
      local.get $31
      i32.const 1
      i32.add
      local.set $31
      local.get $3
      i32.const 1
      i32.add
      local.set $3
      br $for-loop|1
     end
    end
    global.get $~lib/memory/__stack_pointer
    local.get $33
    i32.store $0
    local.get $33
    local.get $2
    f32.const 0
    f32.const 255
    local.get $29
    local.get $32
    f32.div
    local.tee $7
    local.get $7
    f32.const 255
    f32.gt
    select
    local.get $7
    f32.const 0
    f32.lt
    select
    i32.trunc_sat_f32_u
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8ClampedArray#__set
    global.get $~lib/memory/__stack_pointer
    local.get $33
    i32.store $0
    local.get $33
    local.get $2
    i32.const 1
    i32.add
    f32.const 0
    f32.const 255
    local.get $28
    local.get $32
    f32.div
    local.tee $7
    local.get $7
    f32.const 255
    f32.gt
    select
    local.get $7
    f32.const 0
    f32.lt
    select
    i32.trunc_sat_f32_u
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8ClampedArray#__set
    global.get $~lib/memory/__stack_pointer
    local.get $33
    i32.store $0
    local.get $33
    local.get $2
    i32.const 2
    i32.add
    f32.const 0
    f32.const 255
    local.get $27
    local.get $32
    f32.div
    local.tee $7
    local.get $7
    f32.const 255
    f32.gt
    select
    local.get $7
    f32.const 0
    f32.lt
    select
    i32.trunc_sat_f32_u
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8ClampedArray#__set
    global.get $~lib/memory/__stack_pointer
    local.get $33
    i32.store $0
    global.get $~lib/memory/__stack_pointer
    local.get $0
    i32.store $0 offset=8
    local.get $33
    local.get $2
    i32.const 3
    i32.add
    local.tee $3
    local.get $0
    local.get $3
    call $~lib/typedarray/Uint8ClampedArray#__get
    call $~lib/typedarray/Uint8ClampedArray#__set
    local.get $2
    i32.const 4
    i32.add
    local.set $2
    local.get $6
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $33
 )
 (func $export:src/asm/convolutionmatrixfilter/convolutionmatrixfilter@varargs (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (param $6 i32) (param $7 i32) (param $8 f32) (param $9 f32) (param $10 i32) (param $11 i32) (result i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 2048
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   local.tee $2
   local.get $0
   i32.store $0
   local.get $2
   local.get $4
   i32.store $0 offset=4
   local.get $2
   local.get $5
   i32.store $0 offset=8
   local.get $2
   local.get $6
   i32.store $0 offset=12
   local.get $2
   local.get $7
   i32.store $0 offset=16
   local.get $2
   i32.const 20
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 2048
   i32.lt_s
   br_if $folding-inner0
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   i32.const 20
   memory.fill $0
   block $2of2
    block $1of2
     block $0of2
      block $outOfRange
       global.get $~argumentsLength
       i32.const 10
       i32.sub
       br_table $0of2 $1of2 $2of2 $outOfRange
      end
      unreachable
     end
     i32.const 0
     local.set $10
    end
    i32.const 0
    local.set $11
   end
   global.get $~lib/memory/__stack_pointer
   local.tee $2
   local.get $0
   i32.store $0
   local.get $2
   local.get $4
   i32.store $0 offset=4
   local.get $2
   local.get $5
   i32.store $0 offset=8
   local.get $2
   local.get $6
   i32.store $0 offset=12
   local.get $2
   local.get $7
   i32.store $0 offset=16
   local.get $0
   local.get $1
   local.get $3
   local.get $4
   local.get $5
   local.get $6
   local.get $7
   local.get $8
   local.get $9
   local.get $10
   local.get $11
   call $src/asm/convolutionmatrixfilter/convolutionmatrixfilter
   local.set $0
   global.get $~lib/memory/__stack_pointer
   i32.const 20
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 20
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $0
   return
  end
  i32.const 34848
  i32.const 34896
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $export:src/asm/convolutionmatrixfilter/weighted (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 f32) (result i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 2048
  i32.lt_s
  if
   i32.const 34848
   i32.const 34896
   i32.const 1
   i32.const 1
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.tee $6
  local.get $0
  i32.store $0
  local.get $6
  local.get $4
  i32.store $0 offset=4
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  local.get $4
  local.get $5
  call $src/asm/convolutionmatrixfilter/weighted
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
