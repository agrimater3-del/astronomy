"""
generate_signature_paths.py
Generate smooth, continuous handwritten signature SVG paths for:
Line 1: "Welcome to"
Line 2: "I2IT Astronomy Club"
Underline: Signature flourish sweep
"""

# Let's define cursive letterforms with continuous cubic and quadratic beziers
# We will create clean, realistic handwriting paths with natural handwriting rhythm.

# Coordinates layout:
# ViewBox: 0 0 1000 320
# Line 1: Y around 80 - 110, centered
# Line 2: Y around 160 - 210, centered
# Flourish: Y around 240 - 270

def get_welcome_path():
    # Cursive "Welcome to"
    # Starts at left with an elegant cursive W
    # W -> e -> l -> c -> o -> m -> e
    # to: t -> o
    # A continuous cursive stroke for "Welcome" and "to"
    p = [
        # W
        "M 260 95",
        "C 265 80, 275 60, 285 60",
        "C 292 60, 288 85, 290 110",
        "C 295 115, 305 75, 312 70",
        "C 318 68, 312 95, 316 110",
        "C 320 115, 328 85, 335 80",
        # e
        "C 342 75, 348 95, 344 105",
        "C 340 112, 348 114, 355 106",
        # l
        "C 362 95, 370 55, 375 52",
        "C 380 50, 374 85, 372 110",
        # c
        "C 375 112, 385 102, 390 95",
        "C 388 92, 382 95, 382 105",
        "C 382 112, 392 114, 400 106",
        # o
        "C 405 98, 412 92, 418 94",
        "C 424 96, 420 110, 414 112",
        "C 408 112, 408 100, 416 96",
        "C 422 92, 428 95, 432 100",
        # m
        "C 434 105, 433 112, 434 112",
        "C 436 100, 444 94, 448 95",
        "C 452 96, 449 110, 450 112",
        "C 453 100, 460 94, 465 95",
        "C 470 96, 468 110, 469 112",
        # e
        "C 474 104, 482 95, 486 98",
        "C 489 101, 482 112, 488 112",
        # ligature swoop to 'to'
        "C 498 112, 510 108, 520 100",
        # t
        "C 525 80, 528 65, 532 62",
        "C 534 60, 530 85, 528 110",
        # o
        "C 532 112, 542 102, 546 95",
        "C 552 92, 558 98, 554 108",
        "C 550 114, 542 112, 542 104",
        "C 542 96, 552 92, 560 95",
        # t cross flourish
        "C 568 98, 550 82, 518 84",
        "C 512 84, 540 82, 548 83"
    ]
    return " ".join(p)

def get_club_path():
    # Cursive "I2IT Astronomy Club"
    # An unbroken, dynamic signature stroke across the center
    p = [
        # Capital I
        "M 140 155",
        "C 155 145, 175 142, 170 155",
        "C 165 165, 150 185, 155 195",
        "C 160 202, 180 200, 185 192",
        # 2
        "C 192 175, 210 162, 218 165",
        "C 225 168, 215 185, 205 195",
        "C 198 202, 215 200, 228 198",
        # I
        "C 235 185, 242 165, 240 165",
        "C 238 165, 235 185, 238 198",
        # T
        "C 245 195, 255 168, 258 160",
        "C 252 162, 268 158, 274 158",
        "C 265 160, 260 182, 260 198",
        # Space ligature swoop into 'Astronomy'
        "C 265 202, 280 195, 290 182",
        # A
        "C 298 165, 308 145, 315 142",
        "C 322 140, 312 175, 310 198",
        "C 315 175, 328 155, 332 175",
        "C 334 188, 325 198, 320 198",
        "C 322 188, 332 185, 338 185",
        # s
        "C 344 178, 350 172, 354 175",
        "C 358 178, 348 192, 354 195",
        "C 358 197, 364 190, 368 185",
        # t
        "C 372 172, 375 160, 378 158",
        "C 380 156, 376 182, 375 196",
        # r
        "C 378 198, 386 185, 392 180",
        "C 396 178, 392 188, 394 195",
        # o
        "C 398 198, 406 182, 414 182",
        "C 420 182, 418 196, 412 198",
        "C 406 198, 408 185, 418 182",
        # n
        "C 424 182, 428 196, 430 196",
        "C 434 184, 442 180, 446 182",
        "C 450 184, 448 196, 450 196",
        # o
        "C 456 184, 464 182, 468 184",
        "C 474 186, 470 196, 464 198",
        "C 458 198, 462 184, 470 182",
        # m
        "C 476 184, 480 196, 482 196",
        "C 486 184, 492 182, 496 184",
        "C 500 186, 498 196, 500 196",
        "C 504 184, 510 182, 515 184",
        "C 520 186, 518 196, 520 196",
        # y (with descender loop)
        "C 526 185, 532 182, 536 185",
        "C 540 188, 536 198, 540 198",
        "C 544 198, 548 185, 552 185",
        "C 554 188, 542 225, 535 235",
        "C 528 242, 522 235, 530 220",
        "C 538 205, 560 195, 575 190",
        # C (Club)
        "C 590 170, 605 145, 615 142",
        "C 625 140, 605 175, 595 195",
        "C 590 205, 610 205, 622 195",
        # l
        "C 628 185, 638 150, 642 148",
        "C 646 146, 640 180, 638 198",
        # u
        "C 642 198, 650 185, 656 185",
        "C 660 188, 656 198, 662 198",
        "C 666 198, 672 185, 676 185",
        "C 678 188, 676 198, 678 198",
        # b
        "C 684 188, 692 152, 696 150",
        "C 700 148, 694 185, 694 198",
        "C 698 198, 706 188, 708 192",
        "C 710 196, 702 198, 708 196"
    ]
    return " ".join(p)

def get_flourish_path():
    # Signature flourish underline sweeping back from right to left, then across with an artistic loop
    p = [
        "M 715 198",
        "C 730 200, 755 205, 740 215",
        "C 700 235, 450 255, 220 250",
        "C 150 248, 120 240, 140 232",
        "C 160 225, 240 235, 420 245",
        "C 620 255, 780 252, 850 246",
        "C 865 244, 880 240, 870 248"
    ]
    return " ".join(p)

if __name__ == "__main__":
    print("Welcome Path length:", len(get_welcome_path()))
    print("Club Path length:", len(get_club_path()))
    print("Flourish Path length:", len(get_flourish_path()))
