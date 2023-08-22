(module
 (type $f32_f32_f32_f32_=>_f32 (func (param f32 f32 f32 f32) (result f32)))
 (type $i32_=>_none (func (param i32)))
 (type $none_=>_none (func))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_i32_i32_i32_=>_i32 (func (param i32 i32 i32 i32 i32 i32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (type $i32_i32_i64_=>_none (func (param i32 i32 i64)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_f32_f32_f32_f32_=>_f32 (func (param i32 f32 f32 f32 f32) (result f32)))
 (type $i32_i32_=>_f32 (func (param i32 i32) (result f32)))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (import "env" "BLEND.multiply" (func $src/asm/blendfilter/multiply (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.screen" (func $src/asm/blendfilter/screen (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.overlay" (func $src/asm/blendfilter/overlay (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.darken" (func $src/asm/blendfilter/darken (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.lighten" (func $src/asm/blendfilter/lighten (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.colordodge" (func $src/asm/blendfilter/colordodge (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.colorburn" (func $src/asm/blendfilter/colorburn (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.hardlight" (func $src/asm/blendfilter/hardlight (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.softlight" (func $src/asm/blendfilter/softlight (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.difference" (func $src/asm/blendfilter/difference (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.exclusion" (func $src/asm/blendfilter/exclusion (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.average" (func $src/asm/blendfilter/average (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.lineardodge" (func $src/asm/blendfilter/lineardodge (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.linearburn" (func $src/asm/blendfilter/linearburn (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.negation" (func $src/asm/blendfilter/negation (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.linearlight" (func $src/asm/blendfilter/linearlight (param f32 f32 f32 f32) (result f32)))
 (import "env" "BLEND.normal" (func $src/asm/blendfilter/normal (param f32 f32 f32 f32) (result f32)))
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
 (global $~lib/rt/__rtti_base i32 (i32.const 1920))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 34724))
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
 (data $11 (i32.const 1612) ",")
 (data $11.1 (i32.const 1624) "\02\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $12 (i32.const 1660) "|")
 (data $12.1 (i32.const 1672) "\02\00\00\00^\00\00\00E\00l\00e\00m\00e\00n\00t\00 \00t\00y\00p\00e\00 \00m\00u\00s\00t\00 \00b\00e\00 \00n\00u\00l\00l\00a\00b\00l\00e\00 \00i\00f\00 \00a\00r\00r\00a\00y\00 \00i\00s\00 \00h\00o\00l\00e\00y")
 (data $13 (i32.const 1788) "<")
 (data $13.1 (i32.const 1800) "\02\00\00\00*\00\00\00O\00b\00j\00e\00c\00t\00 \00a\00l\00r\00e\00a\00d\00y\00 \00p\00i\00n\00n\00e\00d")
 (data $14 (i32.const 1852) "<")
 (data $14.1 (i32.const 1864) "\02\00\00\00(\00\00\00O\00b\00j\00e\00c\00t\00 \00i\00s\00 \00n\00o\00t\00 \00p\00i\00n\00n\00e\00d")
 (data $15 (i32.const 1920) "\08\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00A\00\00\00\02\19\00\00\02A\00\00\02\t")
 (export "__new" (func $~lib/rt/itcms/__new))
 (export "__pin" (func $~lib/rt/itcms/__pin))
 (export "__unpin" (func $~lib/rt/itcms/__unpin))
 (export "__collect" (func $~lib/rt/itcms/__collect))
 (export "__rtti_base" (global $~lib/rt/__rtti_base))
 (export "memory" (memory $0))
 (export "blendfilter" (func $export:src/asm/blendfilter/blendfilter))
 (start $~start)
 (func $~lib/rt/itcms/visitRoots
  (local $0 i32)
  (local $1 i32)
  i32.const 1360
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1056
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1680
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1168
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1808
  call $byn-split-outlined-A$~lib/rt/itcms/__visit
  i32.const 1872
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
   i32.const 34724
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
   i32.const 1920
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
   i32.const 1924
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
  i32.const 34736
  i32.const 0
  i32.store $0
  i32.const 36304
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
    i32.const 34736
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
      i32.const 34736
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
  i32.const 34736
  i32.const 36308
  memory.size $0
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  i32.const 34736
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
      i32.const 34724
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
    i32.const 34724
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
     i32.const 34724
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
 (func $src/asm/blendfilter/doblend (param $0 i32) (param $1 f32) (param $2 f32) (param $3 f32) (param $4 f32) (result f32)
  local.get $0
  i32.const 1
  i32.eq
  if (result f32)
   local.get $1
   local.get $2
   local.get $3
   local.get $4
   call $src/asm/blendfilter/multiply
  else
   local.get $0
   i32.const 2
   i32.eq
   if (result f32)
    local.get $1
    local.get $2
    local.get $3
    local.get $4
    call $src/asm/blendfilter/screen
   else
    local.get $0
    i32.const 3
    i32.eq
    if (result f32)
     local.get $1
     local.get $2
     local.get $3
     local.get $4
     call $src/asm/blendfilter/overlay
    else
     local.get $0
     i32.const 4
     i32.eq
     if (result f32)
      local.get $1
      local.get $2
      local.get $3
      local.get $4
      call $src/asm/blendfilter/darken
     else
      local.get $0
      i32.const 5
      i32.eq
      if (result f32)
       local.get $1
       local.get $2
       local.get $3
       local.get $4
       call $src/asm/blendfilter/lighten
      else
       local.get $0
       i32.const 6
       i32.eq
       if (result f32)
        local.get $1
        local.get $2
        local.get $3
        local.get $4
        call $src/asm/blendfilter/colordodge
       else
        local.get $0
        i32.const 7
        i32.eq
        if (result f32)
         local.get $1
         local.get $2
         local.get $3
         local.get $4
         call $src/asm/blendfilter/colorburn
        else
         local.get $0
         i32.const 8
         i32.eq
         if (result f32)
          local.get $1
          local.get $2
          local.get $3
          local.get $4
          call $src/asm/blendfilter/hardlight
         else
          local.get $0
          i32.const 9
          i32.eq
          if (result f32)
           local.get $1
           local.get $2
           local.get $3
           local.get $4
           call $src/asm/blendfilter/softlight
          else
           local.get $0
           i32.const 10
           i32.eq
           if (result f32)
            local.get $1
            local.get $2
            local.get $3
            local.get $4
            call $src/asm/blendfilter/difference
           else
            local.get $0
            i32.const 11
            i32.eq
            if (result f32)
             local.get $1
             local.get $2
             local.get $3
             local.get $4
             call $src/asm/blendfilter/exclusion
            else
             local.get $0
             i32.const 12
             i32.eq
             if (result f32)
              local.get $1
              local.get $2
              local.get $3
              local.get $4
              call $src/asm/blendfilter/average
             else
              local.get $0
              i32.const 13
              i32.eq
              if (result f32)
               local.get $1
               local.get $2
               local.get $3
               local.get $4
               call $src/asm/blendfilter/lineardodge
              else
               local.get $0
               i32.const 14
               i32.eq
               if (result f32)
                local.get $1
                local.get $2
                local.get $3
                local.get $4
                call $src/asm/blendfilter/linearburn
               else
                local.get $0
                i32.const 15
                i32.eq
                if (result f32)
                 local.get $1
                 local.get $2
                 local.get $3
                 local.get $4
                 call $src/asm/blendfilter/negation
                else
                 local.get $0
                 i32.const 16
                 i32.eq
                 if (result f32)
                  local.get $1
                  local.get $2
                  local.get $3
                  local.get $4
                  call $src/asm/blendfilter/linearlight
                 else
                  local.get $1
                  local.get $2
                  local.get $3
                  local.get $4
                  call $src/asm/blendfilter/normal
                 end
                end
               end
              end
             end
            end
           end
          end
         end
        end
       end
      end
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
    i32.const 1808
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
   i32.const 1872
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
 (func $~lib/array/Array<f32>~visit (param $0 i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1956
  i32.lt_s
  if
   i32.const 34752
   i32.const 34800
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
  i32.load $0
  local.tee $0
  if
   local.get $0
   call $byn-split-outlined-A$~lib/rt/itcms/__visit
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/rt/__visit_members (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  block $folding-inner0
   block $invalid
    block $~lib/array/Array<i32>
     block $~lib/array/Array<~lib/typedarray/Uint8ClampedArray>
      block $~lib/array/Array<f32>
       block $~lib/string/String
        block $~lib/arraybuffer/ArrayBuffer
         block $~lib/object/Object
          local.get $0
          i32.const 8
          i32.sub
          i32.load $0
          br_table $~lib/object/Object $~lib/arraybuffer/ArrayBuffer $~lib/string/String $folding-inner0 $folding-inner0 $~lib/array/Array<f32> $~lib/array/Array<~lib/typedarray/Uint8ClampedArray> $~lib/array/Array<i32> $invalid
         end
         return
        end
        return
       end
       return
      end
      local.get $0
      call $~lib/array/Array<f32>~visit
      return
     end
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 1956
     i32.lt_s
     if
      i32.const 34752
      i32.const 34800
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
     local.get $0
     i32.load $0 offset=4
     local.set $1
     local.get $2
     local.get $0
     i32.store $0
     local.get $1
     local.get $0
     i32.load $0 offset=12
     i32.const 2
     i32.shl
     i32.add
     local.set $2
     loop $while-continue|0
      local.get $1
      local.get $2
      i32.lt_u
      if
       local.get $1
       i32.load $0
       local.tee $3
       if
        local.get $3
        call $byn-split-outlined-A$~lib/rt/itcms/__visit
       end
       local.get $1
       i32.const 4
       i32.add
       local.set $1
       br $while-continue|0
      end
     end
     global.get $~lib/memory/__stack_pointer
     local.get $0
     i32.store $0
     local.get $0
     i32.load $0
     local.tee $0
     if
      local.get $0
      call $byn-split-outlined-A$~lib/rt/itcms/__visit
     end
     global.get $~lib/memory/__stack_pointer
     i32.const 4
     i32.add
     global.set $~lib/memory/__stack_pointer
     return
    end
    local.get $0
    call $~lib/array/Array<f32>~visit
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
  i32.const 34724
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
  i32.const 1956
  i32.lt_s
  if
   i32.const 34752
   i32.const 34800
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
 (func $~lib/array/Array<f32>#__get (param $0 i32) (param $1 i32) (result f32)
  (local $2 f32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1956
  i32.lt_s
  if
   i32.const 34752
   i32.const 34800
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
  i32.load $0 offset=12
  i32.ge_u
  if
   i32.const 1360
   i32.const 1632
   i32.const 114
   i32.const 42
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
 (func $~lib/array/Array<i32>#__get (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1956
  i32.lt_s
  if
   i32.const 34752
   i32.const 34800
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
  i32.load $0 offset=12
  i32.ge_u
  if
   i32.const 1360
   i32.const 1632
   i32.const 114
   i32.const 42
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
  i32.const 2
  i32.shl
  i32.add
  i32.load $0
  local.set $0
  local.get $2
  i32.const 4
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
  i32.const 1956
  i32.lt_s
  if
   i32.const 34752
   i32.const 34800
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
  i32.const 1956
  i32.lt_s
  if
   i32.const 34752
   i32.const 34800
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
 (func $src/asm/blendfilter/blendfilter (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (result i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 f32)
  (local $11 f32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 f32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 f32)
  (local $27 f32)
  (local $28 f32)
  (local $29 f32)
  (local $30 i32)
  (local $31 f32)
  (local $32 f32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  block $folding-inner1
   global.get $~lib/memory/__stack_pointer
   i32.const 1956
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   local.tee $6
   i64.const 0
   i64.store $0
   local.get $6
   i64.const 0
   i64.store $0 offset=8
   local.get $6
   local.get $3
   i32.store $0
   local.get $6
   i32.const 4
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1956
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   local.tee $6
   i32.const 0
   i32.store $0
   local.get $6
   local.get $3
   i32.store $0
   local.get $3
   i32.load $0 offset=12
   local.set $8
   local.get $6
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   local.get $0
   i32.store $0
   local.get $0
   call $~lib/typedarray/Uint8ClampedArray#get:length
   local.set $9
   global.get $~lib/memory/__stack_pointer
   block $__inlined_func$~lib/typedarray/Uint8ClampedArray#constructor (result i32)
    global.get $~lib/memory/__stack_pointer
    i32.const 8
    i32.sub
    global.set $~lib/memory/__stack_pointer
    block $folding-inner00
     global.get $~lib/memory/__stack_pointer
     i32.const 1956
     i32.lt_s
     br_if $folding-inner00
     global.get $~lib/memory/__stack_pointer
     local.tee $6
     i64.const 0
     i64.store $0
     local.get $6
     i32.const 12
     i32.const 4
     call $~lib/rt/itcms/__new
     local.tee $12
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     local.tee $6
     local.set $7
     local.get $6
     local.get $12
     i32.store $0 offset=4
     local.get $6
     i32.const 16
     i32.sub
     global.set $~lib/memory/__stack_pointer
     global.get $~lib/memory/__stack_pointer
     i32.const 1956
     i32.lt_s
     br_if $folding-inner00
     global.get $~lib/memory/__stack_pointer
     local.tee $6
     i64.const 0
     i64.store $0
     local.get $6
     i64.const 0
     i64.store $0 offset=8
     local.get $12
     i32.eqz
     if
      global.get $~lib/memory/__stack_pointer
      i32.const 12
      i32.const 3
      call $~lib/rt/itcms/__new
      local.tee $12
      i32.store $0
     end
     global.get $~lib/memory/__stack_pointer
     local.get $12
     i32.store $0 offset=4
     local.get $12
     i32.const 0
     call $~lib/arraybuffer/ArrayBufferView#set:buffer
     global.get $~lib/memory/__stack_pointer
     local.get $12
     i32.store $0 offset=4
     local.get $12
     i32.const 0
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $12
     i32.store $0 offset=4
     local.get $12
     i32.const 0
     i32.store $0 offset=8
     local.get $9
     i32.const 1073741820
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
     local.get $9
     i32.const 1
     call $~lib/rt/itcms/__new
     local.tee $6
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     local.get $12
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $6
     i32.store $0 offset=12
     local.get $12
     local.get $6
     call $~lib/arraybuffer/ArrayBufferView#set:buffer
     global.get $~lib/memory/__stack_pointer
     local.get $12
     i32.store $0 offset=4
     local.get $12
     local.get $6
     i32.store $0 offset=4
     global.get $~lib/memory/__stack_pointer
     local.get $12
     i32.store $0 offset=4
     local.get $12
     local.get $9
     i32.store $0 offset=8
     global.get $~lib/memory/__stack_pointer
     i32.const 16
     i32.add
     global.set $~lib/memory/__stack_pointer
     local.get $7
     local.get $12
     i32.store $0
     global.get $~lib/memory/__stack_pointer
     i32.const 8
     i32.add
     global.set $~lib/memory/__stack_pointer
     local.get $12
     br $__inlined_func$~lib/typedarray/Uint8ClampedArray#constructor
    end
    br $folding-inner1
   end
   local.tee $30
   i32.store $0 offset=4
   global.get $~lib/memory/__stack_pointer
   local.tee $6
   local.get $30
   i32.store $0
   local.get $6
   local.get $0
   i32.store $0 offset=8
   local.get $6
   i32.const 12
   i32.sub
   global.set $~lib/memory/__stack_pointer
   global.get $~lib/memory/__stack_pointer
   i32.const 1956
   i32.lt_s
   br_if $folding-inner1
   global.get $~lib/memory/__stack_pointer
   local.tee $6
   i64.const 0
   i64.store $0
   local.get $6
   i32.const 0
   i32.store $0 offset=8
   local.get $6
   local.get $30
   i32.store $0
   local.get $6
   local.get $0
   i32.store $0 offset=4
   local.get $6
   local.get $0
   i32.store $0 offset=8
   local.get $0
   call $~lib/typedarray/Uint8ClampedArray#get:length
   local.set $9
   global.get $~lib/memory/__stack_pointer
   local.get $30
   i32.store $0 offset=8
   local.get $30
   call $~lib/typedarray/Uint8ClampedArray#get:length
   local.get $9
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
   local.tee $7
   local.get $30
   i32.store $0 offset=8
   local.get $30
   i32.load $0 offset=4
   local.set $6
   local.get $7
   local.get $0
   i32.store $0 offset=8
   local.get $6
   local.get $0
   i32.load $0 offset=4
   local.get $9
   memory.copy $0 $0
   local.get $7
   i32.const 12
   i32.add
   global.set $~lib/memory/__stack_pointer
   loop $for-loop|0
    local.get $8
    local.get $16
    i32.gt_s
    if
     global.get $~lib/memory/__stack_pointer
     local.get $3
     i32.store $0
     block $for-continue|0
      local.get $3
      local.get $16
      i32.const 3
      i32.add
      call $~lib/array/Array<f32>#__get
      f32.const 0
      f32.eq
      br_if $for-continue|0
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store $0
      local.get $3
      local.get $16
      call $~lib/array/Array<f32>#__get
      i32.trunc_sat_f32_s
      local.set $17
      global.get $~lib/memory/__stack_pointer
      local.set $6
      global.get $~lib/memory/__stack_pointer
      local.get $4
      i32.store $0
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.sub
      global.set $~lib/memory/__stack_pointer
      global.get $~lib/memory/__stack_pointer
      i32.const 1956
      i32.lt_s
      br_if $folding-inner1
      global.get $~lib/memory/__stack_pointer
      local.tee $0
      i64.const 0
      i64.store $0
      local.get $0
      local.get $4
      i32.store $0
      local.get $18
      local.get $4
      i32.load $0 offset=12
      i32.ge_u
      if
       i32.const 1360
       i32.const 1632
       i32.const 114
       i32.const 42
       call $~lib/builtins/abort
       unreachable
      end
      global.get $~lib/memory/__stack_pointer
      local.tee $0
      local.get $4
      i32.store $0
      local.get $0
      local.get $4
      i32.load $0 offset=4
      local.get $18
      i32.const 2
      i32.shl
      i32.add
      i32.load $0
      local.tee $15
      i32.store $0 offset=4
      local.get $15
      i32.eqz
      if
       i32.const 1680
       i32.const 1632
       i32.const 118
       i32.const 40
       call $~lib/builtins/abort
       unreachable
      end
      global.get $~lib/memory/__stack_pointer
      i32.const 8
      i32.add
      global.set $~lib/memory/__stack_pointer
      local.get $6
      local.get $15
      i32.store $0 offset=12
      global.get $~lib/memory/__stack_pointer
      local.get $5
      i32.store $0
      local.get $5
      local.get $18
      i32.const 1
      i32.shl
      local.tee $0
      call $~lib/array/Array<i32>#__get
      local.set $19
      global.get $~lib/memory/__stack_pointer
      local.get $5
      i32.store $0
      local.get $5
      local.get $0
      i32.const 1
      i32.add
      call $~lib/array/Array<i32>#__get
      local.set $7
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store $0
      local.get $3
      local.get $16
      i32.const 1
      i32.add
      call $~lib/array/Array<f32>#__get
      local.tee $11
      f32.ceil
      local.tee $10
      local.get $10
      f32.const -1
      f32.add
      local.get $10
      f32.const -0.5
      f32.add
      local.get $11
      f32.le
      select
      i32.trunc_sat_f32_s
      local.set $6
      global.get $~lib/memory/__stack_pointer
      local.get $3
      i32.store $0
      local.get $3
      local.get $16
      i32.const 2
      i32.add
      call $~lib/array/Array<f32>#__get
      local.tee $11
      f32.ceil
      local.tee $10
      local.get $10
      f32.const -1
      f32.add
      local.get $10
      f32.const -0.5
      f32.add
      local.get $11
      f32.le
      select
      i32.trunc_sat_f32_s
      local.set $0
      i32.const 0
      local.set $9
      i32.const 0
      local.set $14
      local.get $0
      i32.const 0
      i32.lt_s
      if
       i32.const 0
       local.get $0
       i32.sub
       local.set $14
       i32.const 0
       local.set $0
      end
      local.get $6
      i32.const 0
      i32.lt_s
      if
       i32.const 0
       local.get $6
       i32.sub
       local.set $9
       i32.const 0
       local.set $6
      end
      local.get $1
      local.get $6
      i32.le_s
      local.get $0
      local.get $2
      i32.ge_s
      i32.or
      local.get $9
      local.get $19
      i32.ge_s
      i32.or
      local.get $7
      local.get $14
      i32.le_s
      i32.or
      br_if $for-continue|0
      local.get $2
      local.get $0
      i32.sub
      f32.convert_i32_s
      local.get $7
      local.get $14
      i32.sub
      f32.convert_i32_s
      f32.min
      i32.trunc_sat_f32_s
      local.tee $13
      i32.const 0
      i32.le_s
      local.get $1
      local.get $6
      i32.sub
      f32.convert_i32_s
      local.get $19
      local.get $9
      i32.sub
      f32.convert_i32_s
      f32.min
      i32.trunc_sat_f32_s
      local.tee $12
      i32.const 0
      i32.le_s
      i32.or
      br_if $for-continue|0
      local.get $6
      local.set $7
      local.get $0
      local.get $1
      i32.mul
      local.set $21
      local.get $14
      local.get $19
      i32.mul
      local.set $22
      local.get $6
      local.get $12
      i32.add
      local.set $24
      local.get $12
      local.get $9
      local.tee $0
      i32.add
      local.set $25
      i32.const 0
      local.set $23
      local.get $12
      local.get $13
      i32.mul
      local.set $14
      loop $for-loop|1
       local.get $14
       local.get $23
       i32.gt_s
       if
        global.get $~lib/memory/__stack_pointer
        local.get $30
        i32.store $0
        local.get $30
        local.get $7
        local.get $21
        i32.add
        i32.const 2
        i32.shl
        local.tee $13
        call $~lib/typedarray/Uint8ClampedArray#__get
        f32.convert_i32_u
        local.set $11
        global.get $~lib/memory/__stack_pointer
        local.get $30
        i32.store $0
        local.get $30
        local.get $13
        i32.const 1
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        f32.convert_i32_u
        local.set $26
        global.get $~lib/memory/__stack_pointer
        local.get $30
        i32.store $0
        local.get $30
        local.get $13
        i32.const 2
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        f32.convert_i32_u
        local.set $27
        global.get $~lib/memory/__stack_pointer
        local.get $30
        i32.store $0
        local.get $30
        local.get $13
        i32.const 3
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        f32.convert_i32_u
        f32.const 255
        f32.div
        local.set $31
        global.get $~lib/memory/__stack_pointer
        local.get $15
        i32.store $0
        local.get $15
        local.get $0
        local.get $22
        i32.add
        i32.const 2
        i32.shl
        local.tee $12
        call $~lib/typedarray/Uint8ClampedArray#__get
        f32.convert_i32_u
        local.set $10
        global.get $~lib/memory/__stack_pointer
        local.get $15
        i32.store $0
        local.get $15
        local.get $12
        i32.const 1
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        f32.convert_i32_u
        local.set $28
        global.get $~lib/memory/__stack_pointer
        local.get $15
        i32.store $0
        local.get $15
        local.get $12
        i32.const 2
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        f32.convert_i32_u
        local.set $29
        global.get $~lib/memory/__stack_pointer
        local.get $15
        i32.store $0
        local.get $15
        local.get $12
        i32.const 3
        i32.add
        call $~lib/typedarray/Uint8ClampedArray#__get
        f32.convert_i32_u
        f32.const 255
        f32.div
        local.set $32
        local.get $17
        if (result f32)
         local.get $32
         local.get $31
         f32.add
         local.get $32
         local.get $31
         f32.mul
         f32.sub
        else
         local.get $32
         local.get $31
         f32.const 1
         local.get $32
         f32.sub
         f32.mul
         f32.add
        end
        local.tee $20
        f32.const 0
        f32.gt
        if
         global.get $~lib/memory/__stack_pointer
         local.get $30
         i32.store $0
         local.get $30
         local.get $13
         local.get $17
         local.get $31
         local.get $11
         f32.mul
         f32.const 255
         f32.div
         local.get $31
         local.get $32
         local.get $10
         f32.mul
         f32.const 255
         f32.div
         local.get $32
         call $src/asm/blendfilter/doblend
         f32.const 255
         f32.mul
         local.get $20
         f32.div
         local.tee $11
         f32.ceil
         local.tee $10
         local.get $10
         f32.const -1
         f32.add
         local.get $10
         f32.const -0.5
         f32.add
         local.get $11
         f32.le
         select
         f32.const 0
         f32.max
         f32.const 255
         f32.min
         i32.trunc_sat_f32_u
         i32.const 255
         i32.and
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $30
         i32.store $0
         local.get $30
         local.get $13
         i32.const 1
         i32.add
         local.get $17
         local.get $31
         local.get $26
         f32.mul
         f32.const 255
         f32.div
         local.get $31
         local.get $32
         local.get $28
         f32.mul
         f32.const 255
         f32.div
         local.get $32
         call $src/asm/blendfilter/doblend
         f32.const 255
         f32.mul
         local.get $20
         f32.div
         local.tee $11
         f32.ceil
         local.tee $10
         local.get $10
         f32.const -1
         f32.add
         local.get $10
         f32.const -0.5
         f32.add
         local.get $11
         f32.le
         select
         f32.const 0
         f32.max
         f32.const 255
         f32.min
         i32.trunc_sat_f32_u
         i32.const 255
         i32.and
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $30
         i32.store $0
         local.get $30
         local.get $13
         i32.const 2
         i32.add
         local.get $17
         local.get $31
         local.get $27
         f32.mul
         f32.const 255
         f32.div
         local.get $31
         local.get $32
         local.get $29
         f32.mul
         f32.const 255
         f32.div
         local.get $32
         call $src/asm/blendfilter/doblend
         f32.const 255
         f32.mul
         local.get $20
         f32.div
         local.tee $11
         f32.ceil
         local.tee $10
         local.get $10
         f32.const -1
         f32.add
         local.get $10
         f32.const -0.5
         f32.add
         local.get $11
         f32.le
         select
         f32.const 0
         f32.max
         f32.const 255
         f32.min
         i32.trunc_sat_f32_u
         i32.const 255
         i32.and
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $30
         i32.store $0
         local.get $30
         local.get $13
         i32.const 3
         i32.add
         local.get $20
         f32.const 255
         f32.mul
         local.tee $11
         f32.ceil
         local.tee $10
         local.get $10
         f32.const -1
         f32.add
         local.get $10
         f32.const -0.5
         f32.add
         local.get $11
         f32.le
         select
         f32.const 0
         f32.max
         f32.const 255
         f32.min
         i32.trunc_sat_f32_u
         i32.const 255
         i32.and
         call $~lib/typedarray/Uint8ClampedArray#__set
        else
         global.get $~lib/memory/__stack_pointer
         local.get $30
         i32.store $0
         local.get $30
         local.get $13
         i32.const 0
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $30
         i32.store $0
         local.get $30
         local.get $13
         i32.const 1
         i32.add
         i32.const 0
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $30
         i32.store $0
         local.get $30
         local.get $13
         i32.const 2
         i32.add
         i32.const 0
         call $~lib/typedarray/Uint8ClampedArray#__set
         global.get $~lib/memory/__stack_pointer
         local.get $30
         i32.store $0
         local.get $30
         local.get $13
         i32.const 3
         i32.add
         i32.const 0
         call $~lib/typedarray/Uint8ClampedArray#__set
        end
        local.get $24
        local.get $7
        i32.const 1
        i32.add
        local.tee $7
        i32.le_s
        if
         local.get $1
         local.get $21
         i32.add
         local.set $21
         local.get $6
         local.set $7
        end
        local.get $25
        local.get $0
        i32.const 1
        i32.add
        local.tee $0
        i32.le_s
        if
         local.get $19
         local.get $22
         i32.add
         local.set $22
         local.get $9
         local.set $0
        end
        local.get $23
        i32.const 1
        i32.add
        local.set $23
        br $for-loop|1
       end
      end
     end
     local.get $16
     i32.const 4
     i32.add
     local.set $16
     local.get $18
     i32.const 1
     i32.add
     local.set $18
     br $for-loop|0
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 16
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $30
   return
  end
  i32.const 34752
  i32.const 34800
  i32.const 1
  i32.const 1
  call $~lib/builtins/abort
  unreachable
 )
 (func $export:src/asm/blendfilter/blendfilter (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32) (param $4 i32) (param $5 i32) (result i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 16
  i32.sub
  global.set $~lib/memory/__stack_pointer
  global.get $~lib/memory/__stack_pointer
  i32.const 1956
  i32.lt_s
  if
   i32.const 34752
   i32.const 34800
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
  local.get $3
  i32.store $0 offset=4
  local.get $6
  local.get $4
  i32.store $0 offset=8
  local.get $6
  local.get $5
  i32.store $0 offset=12
  local.get $0
  local.get $1
  local.get $2
  local.get $3
  local.get $4
  local.get $5
  call $src/asm/blendfilter/blendfilter
  local.set $0
  global.get $~lib/memory/__stack_pointer
  i32.const 16
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
